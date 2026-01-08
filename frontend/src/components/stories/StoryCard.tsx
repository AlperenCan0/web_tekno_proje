import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardBody } from '../ui';
import { MapPin, Heart, MessageCircle, Calendar } from 'lucide-react';
import { Story } from '../../types';
import { getPhotoUrl } from '../../config';

export interface StoryCardProps {
  story: Story;
  delay?: number;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card hover clickable className="h-full flex flex-col group">
        {/* Image */}
        {story.photos && story.photos.length > 0 && (
          <Link to={`/stories/${story.id}`} className="block overflow-hidden">
            <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
              <img
                src={getPhotoUrl(story.photos[0])}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        )}

        <CardBody className="flex-1 flex flex-col">
          {/* Categories */}
          {story.categories && story.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {story.categories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {category.name}
                </span>
              ))}
              {story.categories.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{story.categories.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <Link to={`/stories/${story.id}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {story.title}
            </h3>
          </Link>

          {/* Content Preview */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {story.content}
          </p>

          {/* Location */}
          {story.locationName && (
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{story.locationName}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{story.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{story.comments?.length || 0}</span>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(story.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short',
              })}
            </div>
          </div>

          {/* Author */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                {story.author.profile?.avatar ? (
                  <img
                    src={getPhotoUrl(story.author.profile.avatar)}
                    alt={story.author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                    {story.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="font-medium">{story.author.username}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default StoryCard;


