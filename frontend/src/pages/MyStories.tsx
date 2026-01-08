import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storiesApi } from '../services/api';
import { Story } from '../types';
import { getPhotoUrl } from '../config';
import { useApiCall } from '../hooks/useApiCall';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { MESSAGES } from '../constants/messages';
import { Spinner } from '../components/ui';
import { Container } from '../components/layout';
import { Plus, BookOpen } from 'lucide-react';

/**
 * My Stories Page Component - Kullanıcının kendi hikayelerini listeler
 * Hikaye ekleme, düzenleme ve silme işlemlerini yönetir
 */
const MyStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const { execute: executeApiCall, isLoading } = useApiCall<Story[]>();
  const { confirmDelete } = useDeleteConfirmation();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    await executeApiCall(
      () => storiesApi.getMyStories(),
      {
        errorMessage: MESSAGES.ERROR.STORIES_LOAD_FAILED,
        onSuccess: (data) => {
          if (data) setStories(data);
        },
        showToast: false,
      },
    );
  };

  const handleDelete = async (id: string) => {
    confirmDelete(async () => {
      await executeApiCall(
        () => storiesApi.delete(id),
        {
          successMessage: MESSAGES.SUCCESS.STORY_DELETED,
          errorMessage: MESSAGES.ERROR.STORY_DELETE_FAILED,
          onSuccess: () => {
            loadStories();
          },
        },
      );
    });
  };

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" text="Hikayeleriniz yükleniyor..." />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Hikayelerim</h1>
          <p className="text-gray-600">
            {stories.length} hikaye
          </p>
        </div>
        <Link
          to="/create-story"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          Yeni Hikaye Ekle
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Henüz hikaye eklemediniz
          </h3>
          <p className="text-gray-600 mb-6">
            İlk hikayenizi paylaşarak topluluğa katılın
          </p>
          <Link
            to="/create-story"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            İlk Hikayenizi Oluşturun
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              {story.photos && story.photos.length > 0 && (
                <img
                  src={getPhotoUrl(story.photos[0])}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {story.title}
                </h2>
                <p className={`text-gray-600 text-sm mb-4 ${story.photos && story.photos.length > 0 ? 'line-clamp-3' : 'line-clamp-6 md:line-clamp-[8]'}`}>
                  {story.content}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    {story.isPublished ? '✅ Yayında' : '⏸️ Taslak'}
                  </span>
                  <span>{new Date(story.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <Link
                    to={`/edit-story/${story.id}`}
                    className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-md hover:from-amber-700 hover:to-orange-700 transition-all font-medium"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default MyStories;

