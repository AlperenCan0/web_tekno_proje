/**
 * Uygulama Konfigürasyon Dosyası
 * Tüm environment değişkenleri ve sabit değerler burada yönetilir
 */

// API Base URL - Vite environment variable veya varsayılan değer
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fotoğraf URL'si oluşturma helper'ı
export const getPhotoUrl = (path: string): string => {
    if (!path) return '';
    // Eğer tam URL ise aynen döndür
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Aksi halde API base URL ile birleştir
    return `${API_BASE_URL}${path}`;
};

// Config objesi
export const config = {
    apiUrl: API_BASE_URL,

    // Pagination varsayılan değerleri
    pagination: {
        defaultLimit: 10,
        maxLimit: 50,
    },

    // Upload limitleri
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    },
} as const;

export default config;
