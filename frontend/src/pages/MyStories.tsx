import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storiesApi } from '../services/api';
import { Story } from '../types';
import toast from 'react-hot-toast';

/**
 * My Stories Page Component - Kullanıcının kendi hikayelerini listeler
 * Hikaye ekleme, düzenleme ve silme işlemlerini yönetir
 */
const MyStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setIsLoading(true);
      const storiesData = await storiesApi.getMyStories();
      setStories(storiesData);
    } catch (error: any) {
      toast.error('Hikayeler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu hikayeyi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await storiesApi.delete(id);
      await loadStories();
      toast.success('Hikaye silindi');
    } catch (error: any) {
      toast.error('Hikaye silinirken bir hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hikayelerim</h1>
        <Link
          to="/create-story"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Yeni Hikaye Ekle
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Henüz hikaye eklemediniz.</p>
          <Link
            to="/create-story"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            İlk hikayenizi oluşturun →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {story.photos && story.photos.length > 0 && (
                <img
                  src={`http://localhost:3000${story.photos[0]}`}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {story.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {story.content}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    {story.isPublished ? '✅ Yayında' : '⏸️ Taslak'}
                  </span>
                  <span>{new Date(story.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/edit-story/${story.id}`}
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyStories;

