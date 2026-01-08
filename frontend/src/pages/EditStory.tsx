import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storiesApi } from '../services/api';
import { Story } from '../types';
import { StoryForm, StoryFormData } from '../components/stories';
import toast from 'react-hot-toast';

/**
 * Edit Story Page Component - Hikaye düzenleme sayfası
 * StoryForm bileşenini kullanarak kod tekrarını önler
 */
const EditStory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStory, setIsLoadingStory] = useState(true);

  useEffect(() => {
    if (id) {
      loadStory();
    }
  }, [id]);

  const loadStory = async () => {
    try {
      setIsLoadingStory(true);
      const storyData = await storiesApi.getById(id!);
      setStory(storyData);
    } catch (error) {
      toast.error('Hikaye yüklenirken bir hata oluştu');
      navigate('/my-stories');
    } finally {
      setIsLoadingStory(false);
    }
  };

  const handleSubmit = async (data: StoryFormData) => {
    setIsLoading(true);
    try {
      await storiesApi.update(id!, {
        title: data.title,
        content: data.content,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        locationName: data.locationName || undefined,
        photos: data.photos.length > 0 ? data.photos : undefined,
        categoryIds: data.selectedCategories,
        isPublished: data.isPublished,
      });
      toast.success('Hikaye başarıyla güncellendi');
      navigate('/my-stories');
    } catch (error) {
      toast.error('Hikaye güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-stories');
  };

  if (isLoadingStory) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Hikaye Düzenle</h1>
      <StoryForm
        mode="edit"
        initialData={story || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isLoading}
      />
    </div>
  );
};

export default EditStory;
