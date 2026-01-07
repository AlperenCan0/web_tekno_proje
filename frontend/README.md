# Yerel Hikaye Paylaşım Platformu - Frontend

React + TypeScript + Tailwind CSS tabanlı frontend uygulaması.

## Teknolojiler

- **React 18** - UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Context API** - State yönetimi
- **Axios** - HTTP client
- **Google Maps API** - Harita entegrasyonu
- **React Hot Toast** - Bildirimler

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun:
```env
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

3. Uygulamayı çalıştırın:
```bash
npm run dev
```

Uygulama http://localhost:3001 adresinde çalışacaktır.

## Özellikler

### Rol Tabanlı Arayüz

- **User**: Normal kullanıcılar hikaye ekleyebilir, düzenleyebilir ve silebilir
- **Admin/SuperAdmin**: Yönetim paneli erişimi, tüm hikayeleri görme ve yönetme

### Sayfalar

- **Ana Sayfa** (`/`) - Platform tanıtımı ve hızlı erişim
- **Giriş** (`/login`) - Kullanıcı girişi
- **Kayıt** (`/register`) - Yeni kullanıcı kaydı
- **Hikayeler** (`/stories`) - Tüm hikayeleri listeleme ve harita görünümü
- **Hikaye Detay** (`/stories/:id`) - Hikaye detayları, yorumlar ve harita
- **Hikayelerim** (`/my-stories`) - Kullanıcının kendi hikayeleri
- **Hikaye Oluştur** (`/create-story`) - Yeni hikaye oluşturma
- **Hikaye Düzenle** (`/edit-story/:id`) - Hikaye düzenleme
- **Yönetim Paneli** (`/admin`) - Admin/SuperAdmin için yönetim paneli

### Google Maps Entegrasyonu

- Hikayelerin konumları harita üzerinde marker olarak gösterilir
- Hikaye detay sayfasında konum haritası gösterilir
- Google Maps API key gereklidir

## Yapı

```
src/
├── components/       # Yeniden kullanılabilir bileşenler
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── AdminRoute.tsx
│   └── StoryMap.tsx
├── contexts/         # Context API state yönetimi
│   └── AuthContext.tsx
├── pages/            # Sayfa bileşenleri
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Home.tsx
│   ├── Stories.tsx
│   ├── StoryDetail.tsx
│   ├── MyStories.tsx
│   ├── CreateStory.tsx
│   ├── EditStory.tsx
│   └── AdminPanel.tsx
├── services/         # API servisleri
│   └── api.ts
├── types/            # TypeScript tip tanımlamaları
│   └── index.ts
├── App.tsx           # Ana uygulama bileşeni
├── main.tsx          # Giriş noktası
└── index.css         # Global stiller
```

## Build

Production build için:
```bash
npm run build
```

Build çıktısı `dist` klasöründe oluşturulur.

## Notlar

- Backend API'si `http://localhost:3000` adresinde çalışmalıdır
- Google Maps API key'i `.env` dosyasında tanımlanmalıdır
- JWT token localStorage'da saklanır
- Context API ile global state yönetimi yapılır

