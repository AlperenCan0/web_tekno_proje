import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storiesApi } from '../services/api';
import { StoryForm, StoryFormData } from '../components/stories';
import toast from 'react-hot-toast';

/**
 * Create Story Page Component - Yeni hikaye oluşturma sayfası
 * StoryForm bileşenini kullanarak kod tekrarını önler
 */
const CreateStory: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: StoryFormData) => {
    setIsLoading(true);
    try {
      await storiesApi.create({
        title: data.title,
        content: data.content,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        locationName: data.locationName || undefined,
        photos: data.photos.length > 0 ? data.photos : undefined,
        categoryIds: data.selectedCategories,
        isPublished: data.isPublished,
      });
      toast.success('Hikaye başarıyla oluşturuldu');
      navigate('/my-stories');
    } catch (error) {
      toast.error('Hikaye oluşturulurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-stories');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Yeni Hikaye Oluştur</h1>
      <StoryForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isLoading}
      />
    </div>
  );
};

export default CreateStory;
