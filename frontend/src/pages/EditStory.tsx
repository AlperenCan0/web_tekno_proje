import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storiesApi } from '../services/api';
import { Story } from '../types';
import { StoryForm, StoryFormData } from '../components/stories';
import { useApiCall } from '../hooks/useApiCall';
import { MESSAGES } from '../constants/messages';

/**
 * Edit Story Page Component - Hikaye düzenleme sayfası
 * StoryForm bileşenini kullanarak kod tekrarını önler
 */
const EditStory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const { execute: executeApiCall, isLoading } = useApiCall<Story>();
  const { execute: executeLoadStory, isLoading: isLoadingStory } = useApiCall<Story>();

  useEffect(() => {
    if (id) {
      loadStory();
    }
  }, [id]);

  const loadStory = async () => {
    await executeLoadStory(
      () => storiesApi.getById(id!),
      {
        errorMessage: MESSAGES.ERROR.STORY_LOAD_FAILED,
        onSuccess: (data) => {
          if (data) setStory(data);
        },
        onError: () => {
          navigate('/my-stories');
        },
        showToast: false,
      },
    );
  };

  const handleSubmit = async (data: StoryFormData) => {
    await executeApiCall(
      () => storiesApi.update(id!, {
        title: data.title,
        content: data.content,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        locationName: data.locationName || undefined,
        photos: data.photos.length > 0 ? data.photos : undefined,
        categoryIds: data.selectedCategories,
        isPublished: data.isPublished,
      }),
      {
        successMessage: MESSAGES.SUCCESS.STORY_UPDATED,
        errorMessage: MESSAGES.ERROR.STORY_UPDATE_FAILED,
        onSuccess: () => {
          navigate('/my-stories');
        },
      },
    );
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
