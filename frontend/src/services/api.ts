import { api } from '../contexts/AuthContext';
import { Story, Comment, Category, User } from '../types';

/**
 * API Service - Backend API ile iletişim fonksiyonları
 * Tüm CRUD işlemleri için API çağrıları
 */

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
  like: async (id: string, action: 'like' | 'dislike'): Promise<{ story: Story; userAction: string | null }> => {
    const response = await api.post(`/stories/${id}/like`, { action });
    return response.data;
  },

  /**
   * Kullanıcının bu hikayeye verdiği tepkiyi getirir
   */
  getLikeStatus: async (id: string): Promise<{ userAction: string | null }> => {
    const response = await api.get(`/stories/${id}/like-status`);
    return response.data;
  },
};

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
  like: async (id: string, action: 'like' | 'dislike'): Promise<{ comment: Comment; userAction: string | null }> => {
    const response = await api.post(`/comments/${id}/like`, { action });
    return response.data;
  },

  /**
   * Kullanıcının bu yoruma verdiği tepkiyi getirir
   */
  getLikeStatus: async (id: string): Promise<{ userAction: string | null }> => {
    const response = await api.get(`/comments/${id}/like-status`);
    return response.data;
  },
};

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

  /**
   * Yeni kategori oluşturur (Admin/SuperAdmin)
   */
  create: async (data: { name: string; description?: string }): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  /**
   * Kategori günceller (Admin/SuperAdmin)
   */
  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Kategori siler (Admin/SuperAdmin)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export const usersApi = {
  /**
   * Tüm kullanıcıları getirir (Admin/SuperAdmin)
   */
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  /**
   * ID'ye göre kullanıcı getirir
   */
  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Mevcut kullanıcı bilgilerini getirir
   */
  getMe: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  /**
   * Yeni kullanıcı oluşturur (Admin/SuperAdmin)
   */
  create: async (data: {
    email: string;
    username: string;
    password: string;
    role?: 'User' | 'Admin' | 'SuperAdmin';
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
  }): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  /**
   * Kullanıcı bilgilerini günceller
   */
  update: async (id: string, data: Partial<User> & { avatar?: string; firstName?: string; lastName?: string }): Promise<User> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Kullanıcıyı siler (Admin/SuperAdmin)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

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

