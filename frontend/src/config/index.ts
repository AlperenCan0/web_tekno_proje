/**
 * Uygulama Konfigürasyon Dosyası
 * Tüm environment değişkenleri ve sabit değerler burada yönetilir
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getPhotoUrl = (path: string): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `${API_BASE_URL}${path}`;
};

export const config = {
    apiUrl: API_BASE_URL,

    pagination: {
        defaultLimit: 10,
        maxLimit: 50,
    },

    upload: {
        maxFileSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    },
} as const;

export default config;
