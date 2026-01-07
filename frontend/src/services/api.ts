import { api } from '../contexts/AuthContext';
import { Story, Comment, Category, User } from '../types';

/**
 * API Service - Backend API ile iletişim fonksiyonları
 * Tüm CRUD işlemleri için API çağrıları
 */

// Stories API
export const storiesApi = {
  /**
   * Tüm hikayeleri getirir
   */
  getAll: async (publishedOnly: boolean = true): Promise<Story[]> => {
    const response = await api.get(`/stories?publishedOnly=${publishedOnly}`);
    return response.data;
  },

  /**
   * ID'ye göre hikaye getirir
   */
  getById: async (id: string): Promise<Story> => {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },

  /**
   * Kullanıcının hikayelerini getirir
   */
  getMyStories: async (): Promise<Story[]> => {
    const response = await api.get('/stories/my');
    return response.data;
  },

  /**
   * Yeni hikaye oluşturur
   */
  create: async (data: Partial<Story> & { categoryIds?: string[] }): Promise<Story> => {
    const response = await api.post('/stories', data);
    return response.data;
  },

  /**
   * Hikaye günceller
   */
  update: async (id: string, data: Partial<Story> & { categoryIds?: string[] }): Promise<Story> => {
    const response = await api.patch(`/stories/${id}`, data);
    return response.data;
  },

  /**
   * Hikaye siler
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/stories/${id}`);
  },

  /**
   * Hikayeyi beğenir veya beğenmez
   */
  like: async (id: string, action: 'like' | 'dislike'): Promise<Story> => {
    const response = await api.post(`/stories/${id}/like`, { action });
    return response.data;
  },
};

// Comments API
export const commentsApi = {
  /**
   * Tüm yorumları getirir
   */
  getAll: async (storyId?: string): Promise<Comment[]> => {
    const url = storyId ? `/comments?storyId=${storyId}` : '/comments';
    const response = await api.get(url);
    return response.data;
  },

  /**
   * ID'ye göre yorum getirir
   */
  getById: async (id: string): Promise<Comment> => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  /**
   * Yeni yorum oluşturur
   */
  create: async (data: { content: string; storyId: string }): Promise<Comment> => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  /**
   * Yorum günceller
   */
  update: async (id: string, data: Partial<Comment>): Promise<Comment> => {
    const response = await api.patch(`/comments/${id}`, data);
    return response.data;
  },

  /**
   * Yorum siler
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },

  /**
   * Yorumu beğenir veya beğenmez
   */
  like: async (id: string, action: 'like' | 'dislike'): Promise<Comment> => {
    const response = await api.post(`/comments/${id}/like`, { action });
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  /**
   * Tüm kategorileri getirir
   */
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  /**
   * ID'ye göre kategori getirir
   */
  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

// Users API
export const usersApi = {
  /**
   * Tüm kullanıcıları getirir (Admin/SuperAdmin)
   */
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  /**
   * Mevcut kullanıcı bilgilerini getirir
   */
  getMe: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

// Upload API
export const uploadApi = {
  /**
   * Fotoğraf yükler
   */
  uploadPhoto: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

