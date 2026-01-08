/**
 * Messages Constants - Tüm toast mesajlarını merkezi olarak yönetir
 * Tekrarlanan mesajları önler ve tutarlılık sağlar
 */
export const MESSAGES = {
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
    USER_CREATED: 'Kullanıcı başarıyla oluşturuldu',
    USER_UPDATED: 'Kullanıcı başarıyla güncellendi',
    USER_DELETED: 'Kullanıcı silindi',
    CATEGORY_CREATED: 'Kategori başarıyla oluşturuldu',
    CATEGORY_UPDATED: 'Kategori başarıyla güncellendi',
    CATEGORY_DELETED: 'Kategori silindi',
  },

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
    USER_CREATE_FAILED: 'Kullanıcı oluşturulurken bir hata oluştu',
    USER_UPDATE_FAILED: 'Kullanıcı güncellenirken bir hata oluştu',
    USER_DELETE_FAILED: 'Kullanıcı silinirken bir hata oluştu',
    CATEGORY_CREATE_FAILED: 'Kategori oluşturulurken bir hata oluştu',
    CATEGORY_UPDATE_FAILED: 'Kategori güncellenirken bir hata oluştu',
    CATEGORY_DELETE_FAILED: 'Kategori silinirken bir hata oluştu',
  },

  VALIDATION: {
    EMAIL_REQUIRED: 'E-posta adresi gereklidir',
    PASSWORD_REQUIRED: 'Şifre gereklidir',
    USERNAME_REQUIRED: 'Kullanıcı adı gereklidir',
  },
} as const;

