import React from 'react';
import { Card, CardBody } from '../ui';
import { User } from '../../types';

export interface AuthorCardProps {
  author: User;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  const initials = author.username.charAt(0).toUpperCase();

  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {initials}
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

