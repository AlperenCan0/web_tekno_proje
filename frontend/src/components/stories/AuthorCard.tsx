import React from 'react';
import { Card, CardBody } from '../ui';
import { User } from '../../types';

import { getPhotoUrl } from '../../config';

export interface AuthorCardProps {
  author: User;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  const initials = author.username.charAt(0).toUpperCase();

  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 flex-shrink-0">
            {author.profile?.avatar ? (
              <img
                src={getPhotoUrl(author.profile.avatar)}
                alt={author.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                {initials}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{author.username}</h3>
            <p className="text-sm text-gray-600">{author.email}</p>
            {author.profile && (
              <p className="text-sm text-gray-500 mt-1">
                {author.profile.firstName} {author.profile.lastName}
              </p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AuthorCard;

