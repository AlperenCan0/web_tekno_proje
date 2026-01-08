/**
 * Messages Constants - Tüm toast mesajlarını merkezi olarak yönetir
 * Tekrarlanan mesajları önler ve tutarlılık sağlar
 */
export const MESSAGES = {
  // Success messages
  SUCCESS: {
    LOGIN: 'Giriş başarılı!',
    REGISTER: 'Kayıt başarılı!',
    LOGOUT: 'Çıkış yapıldı',
    STORY_CREATED: 'Hikaye başarıyla oluşturuldu',
    STORY_UPDATED: 'Hikaye başarıyla güncellendi',
    STORY_DELETED: 'Hikaye silindi',
    COMMENT_ADDED: 'Yorum eklendi',
    COMMENT_UPDATED: 'Yorum güncellendi',
    COMMENT_DELETED: 'Yorum silindi',
    PHOTO_UPLOADED: 'Fotoğraflar yüklendi',
    LIKE_ADDED: 'Beğenildi',
    DISLIKE_ADDED: 'Beğenilmedi',
    VOTE_REMOVED: 'Oy geri alındı',
  },

  // Error messages
  ERROR: {
    LOGIN_FAILED: 'Giriş başarısız',
    REGISTER_FAILED: 'Kayıt başarısız',
    STORIES_LOAD_FAILED: 'Hikayeler yüklenirken bir hata oluştu',
    STORY_LOAD_FAILED: 'Hikaye yüklenirken bir hata oluştu',
    STORY_CREATE_FAILED: 'Hikaye oluşturulurken bir hata oluştu',
    STORY_UPDATE_FAILED: 'Hikaye güncellenirken bir hata oluştu',
    STORY_DELETE_FAILED: 'Hikaye silinirken bir hata oluştu',
    COMMENTS_LOAD_FAILED: 'Yorumlar yüklenirken bir hata oluştu',
    COMMENT_ADD_FAILED: 'Yorum eklenirken bir hata oluştu',
    COMMENT_UPDATE_FAILED: 'Yorum güncellenirken bir hata oluştu',
    COMMENT_DELETE_FAILED: 'Yorum silinirken bir hata oluştu',
    CATEGORIES_LOAD_FAILED: 'Kategoriler yüklenirken bir hata oluştu',
    PHOTO_UPLOAD_FAILED: 'Fotoğraf yüklenirken bir hata oluştu',
    DATA_LOAD_FAILED: 'Veriler yüklenirken bir hata oluştu',
    OPERATION_FAILED: 'İşlem başarısız',
    AUTH_REQUIRED: 'Bu işlem için giriş yapmalısınız',
    COMMENT_EMPTY: 'Yorum boş olamaz',
    TITLE_CONTENT_REQUIRED: 'Başlık ve içerik zorunludur',
  },

  // Validation messages
  VALIDATION: {
    EMAIL_REQUIRED: 'E-posta adresi gereklidir',
    PASSWORD_REQUIRED: 'Şifre gereklidir',
    USERNAME_REQUIRED: 'Kullanıcı adı gereklidir',
  },
} as const;

