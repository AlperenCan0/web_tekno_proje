import React, { useState } from 'react';
import { Comment } from '../../types';
import { Card, CardBody, Button, Input } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { MessageCircle, Heart, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { commentsApi } from '../../services/api';
import { useApiCall } from '../../hooks/useApiCall';
import { MESSAGES } from '../../constants/messages';

export interface CommentSectionProps {
  storyId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  storyId,
  comments,
  onCommentAdded,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const { execute: executeApiCall, isLoading: isSubmitting } = useApiCall();

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    await executeApiCall(
      () => commentsApi.create({ content: newComment, storyId }),
      {
        successMessage: MESSAGES.SUCCESS.COMMENT_ADDED,
        errorMessage: MESSAGES.ERROR.COMMENT_ADD_FAILED,
        onSuccess: () => {
          setNewComment('');
          onCommentAdded();
        },
      },
    );
  };

  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-5 h-5 text-amber-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Yorumlar ({comments.length})
          </h2>
        </div>

        {isAuthenticated && (
          <div className="mb-6">
            <Input
              as="textarea"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yorumunuzu yazın..."
              rows={4}
              className="resize-none"
            />
            <Button
              onClick={handleAddComment}
              disabled={isSubmitting || !newComment.trim()}
              className="mt-3"
              variant="primary"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Yorum Ekle'}
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {comment.author.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {comment.author.username}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Henüz yorum yok. İlk yorumu siz yapın!</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default CommentSection;

