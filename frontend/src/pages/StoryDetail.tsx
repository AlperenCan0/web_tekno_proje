import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storiesApi, commentsApi } from '../services/api';
import { Story, Comment } from '../types';
import toast from 'react-hot-toast';
import StoryMap from '../components/StoryMap';
import { Card, CardBody, Button, Spinner } from '../components/ui';
import { Container } from '../components/layout';
import { AuthorCard, CommentSection } from '../components/stories';
import { ArrowLeft, Heart, MapPin, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPhotoUrl } from '../config';

/**
 * Story Detail Page Component - Hikaye detay sayfası
 * Hikaye içeriği, yorumlar ve harita görünümü gösterir
 */
const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadStory();
      loadComments();
    }
  }, [id]);

  const loadStory = async () => {
    try {
      setIsLoading(true);
      const storyData = await storiesApi.getById(id!);
      setStory(storyData);
    } catch (error: any) {
      toast.error('Hikaye yüklenirken bir hata oluştu');
      navigate('/stories');
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await commentsApi.getAll(id);
      setComments(commentsData);
    } catch (error: any) {
      toast.error('Yorumlar yüklenirken bir hata oluştu');
    }
  };

  const reloadComments = async () => {
    await loadComments();
  };

  const handleLikeStory = async (action: 'like' | 'dislike') => {
    try {
      await storiesApi.like(id!, action);
      await loadStory();
      toast.success(action === 'like' ? 'Beğenildi' : 'Beğenilmedi');
    } catch (error: any) {
      toast.error('İşlem başarısız');
    }
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
      {/* Hero Image Section */}
      {story.photos && story.photos.length > 0 && (
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={getPhotoUrl(story.photos[0])}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
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
                    className="flex items-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    <span>{story.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleLikeStory('dislike')}
                    className="flex items-center gap-2"
                  >
                    <Heart className="w-5 h-5 rotate-180" />
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

                {/* Additional Photos */}
                {story.photos && story.photos.length > 1 && (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {story.photos.slice(1).map((photo, index) => (
                      <img
                        key={index}
                        src={getPhotoUrl(photo)}
                        alt={`${story.title} - Fotoğraf ${index + 2}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
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

