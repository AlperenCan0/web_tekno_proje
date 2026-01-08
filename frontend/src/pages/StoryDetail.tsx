import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storiesApi, commentsApi } from '../services/api';
import { Story, Comment } from '../types';
import StoryMap from '../components/StoryMap';
import { Card, CardBody, Button, Spinner } from '../components/ui';
import { Container } from '../components/layout';
import { AuthorCard, CommentSection, ImageGallery } from '../components/stories';
import { ArrowLeft, Heart, MapPin, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPhotoUrl } from '../config';
import { useApiCall } from '../hooks/useApiCall';
import { MESSAGES } from '../constants/messages';

/**
 * Story Detail Page Component - Hikaye detay sayfası
 * Hikaye içeriği, yorumlar ve harita görünümü gösterir
 */
const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { execute: executeLoadStory, isLoading } = useApiCall<Story>();
  const { execute: executeLoadComments } = useApiCall<Comment[]>();
  const { execute: executeLikeStory } = useApiCall<{ story: Story; userAction: string | null }>();

  useEffect(() => {
    if (id) {
      loadStory();
      loadComments();
      loadLikeStatus();
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
          navigate('/stories');
        },
        showToast: false,
      },
    );
  };

  const loadComments = async () => {
    await executeLoadComments(
      () => commentsApi.getAll(id),
      {
        errorMessage: MESSAGES.ERROR.COMMENTS_LOAD_FAILED,
        onSuccess: (data) => {
          if (data) setComments(data);
        },
        showToast: false,
      },
    );
  };

  const loadLikeStatus = async () => {
    try {
      const response = await storiesApi.getLikeStatus(id!);
      setUserAction(response.userAction as 'like' | 'dislike' | null);
    } catch (error: any) {
      // Giriş yapmamış kullanıcılar için hata yoksay
    }
  };

  const reloadComments = async () => {
    await loadComments();
  };

  const handleLikeStory = async (action: 'like' | 'dislike') => {
    await executeLikeStory(
      () => storiesApi.like(id!, action),
      {
        successMessage: (response) => {
          if (response?.userAction === null) {
            return MESSAGES.SUCCESS.VOTE_REMOVED;
          } else if (response?.userAction === 'like') {
            return MESSAGES.SUCCESS.LIKE_ADDED;
          } else {
            return MESSAGES.SUCCESS.DISLIKE_ADDED;
          }
        },
        errorMessage: MESSAGES.ERROR.OPERATION_FAILED,
        onSuccess: (response) => {
          if (response) {
            setStory(response.story);
            setUserAction(response.userAction as 'like' | 'dislike' | null);
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" text="Hikaye yükleniyor..." />
        </div>
      </Container>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section - Küçültülmüş ve tıklanabilir */}
      {story.photos && story.photos.length > 0 && (
        <div 
          className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 cursor-pointer group"
          onClick={() => {
            setSelectedImageIndex(0);
            setImageModalOpen(true);
          }}
        >
          <img
            src={getPhotoUrl(story.photos[0])}
            alt={story.title}
            className="w-full h-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/70 transition-all duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium">
              Fotoğrafı büyütmek için tıklayın
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pointer-events-none">
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {story.title}
                </h1>
              </motion.div>
            </Container>
          </div>
        </div>
      )}

      <Container className="py-8">
        {/* Back Button */}
        <Link
          to="/stories"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Hikayelere Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Story Card */}
            {!story.photos && (
              <Card>
                <CardBody>
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">{story.title}</h1>
                </CardBody>
              </Card>
            )}

            {/* Meta Information */}
            <Card>
              <CardBody>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(story.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {story.locationName && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{story.locationName}</span>
                    </div>
                  )}
                </div>

                {/* Categories */}
                {story.categories && story.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {story.categories.map((category) => (
                      <span
                        key={category.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        <Tag className="w-3 h-3" />
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Like/Dislike */}
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => handleLikeStory('like')}
                    className={`flex items-center gap-2 ${userAction === 'like' ? '!bg-green-100 !text-green-600' : ''}`}
                  >
                    <Heart className={`w-5 h-5 ${userAction === 'like' ? 'fill-green-600' : ''}`} />
                    <span>{story.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleLikeStory('dislike')}
                    className={`flex items-center gap-2 ${userAction === 'dislike' ? '!bg-red-100 !text-red-600' : ''}`}
                  >
                    <Heart className={`w-5 h-5 rotate-180 ${userAction === 'dislike' ? 'fill-red-600' : ''}`} />
                    <span>{story.dislikes}</span>
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Story Content */}
            <Card>
              <CardBody>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                    {story.content}
                  </p>
                </div>

                {/* Image Gallery - Tüm fotoğraflar küçük thumbnail'ler olarak gösterilir */}
                {story.photos && story.photos.length > 0 && (
                  <ImageGallery 
                    images={story.photos} 
                    title={story.title}
                    initialIndex={selectedImageIndex}
                    isOpen={imageModalOpen}
                    onClose={() => setImageModalOpen(false)}
                    onImageClick={(index) => {
                      setSelectedImageIndex(index);
                      setImageModalOpen(true);
                    }}
                  />
                )}
              </CardBody>
            </Card>

            {/* Map */}
            {story.latitude && story.longitude && (
              <Card>
                <CardBody>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Konum
                  </h2>
                  <div className="rounded-lg overflow-hidden">
                    <StoryMap stories={[story]} />
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Comments */}
            <CommentSection
              storyId={story.id}
              comments={comments}
              onCommentAdded={reloadComments}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <AuthorCard author={story.author} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default StoryDetail;

