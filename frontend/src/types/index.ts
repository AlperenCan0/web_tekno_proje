/**
 * Type definitions - Uygulama genelinde kullanılan tip tanımlamaları
 */

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'User' | 'Admin' | 'SuperAdmin';
  profile?: Profile;
}

export interface Profile {
  id: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  location?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  photos?: string[];
  likes: number;
  dislikes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: User;
  authorId: string;
  categories?: Category[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  author: User;
  authorId: string;
  story: Story;
  storyId: string;
}

