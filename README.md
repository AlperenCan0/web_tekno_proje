# Yerel Hikaye Paylaşım Platformu

NestJS (Backend) ve React (Frontend) kullanılarak geliştirilmiş yerel hikaye paylaşım platformu.

## Proje Yapısı

```
.
├── backend/          # NestJS backend uygulaması
├── frontend/         # React frontend uygulaması
└── README.md         # Bu dosya
```

## Özellikler

### Backend (NestJS)

- ✅ SQLite + TypeORM ile veritabanı yönetimi
- ✅ JWT tabanlı kimlik doğrulama ve yetkilendirme
- ✅ 3 rol sistemi: User, Admin, SuperAdmin
- ✅ Tüm entity'ler için CRUD işlemleri
- ✅ Swagger UI ile API dokümantasyonu
- ✅ Fotoğraf yükleme desteği
- ✅ Like/Dislike sistemi
- ✅ Google Maps koordinat desteği

### Frontend (React)

- ✅ React Router ile sayfa yönetimi
- ✅ Context API ile state yönetimi
- ✅ Rol tabanlı UI ve routing
- ✅ Google Maps entegrasyonu (haritadan konum seçme)
- ✅ Tailwind CSS ile modern tasarım
- ✅ Responsive tasarım

## Veri Modeli ve İlişkiler

1. **User & Profile** (One-to-One)
   - Kullanıcı temel bilgileri ve detaylı profil verileri

2. **User & Story** (One-to-Many)
   - Bir kullanıcı birden fazla hikaye paylaşabilir

3. **Story & Category** (Many-to-Many)
   - Bir hikaye birden fazla kategoride olabilir
   - Bir kategoride çokça hikaye bulunabilir

4. **Story & Comment** (One-to-Many)
   - Hikayelere kullanıcılar yorum yapabilir

## Kurulum

### Backend

1. `backend` klasörüne gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. (Opsiyonel) `.env` dosyasını oluşturun - varsayılan değerler kullanılır:
```env
DB_DATABASE=./database.sqlite
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
UPLOAD_DEST=./uploads
```

4. Uygulamayı çalıştırın:
```bash
npm run start:dev
```

Backend http://localhost:3000 adresinde çalışacaktır.
Swagger dokümantasyonu: http://localhost:3000/api

### Frontend

1. `frontend` klasörüne gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun ve Google Maps API key'i ekleyin:
```env
VITE_GOOGLE_MAPS_API_KEY=your-api-key
```

4. Uygulamayı çalıştırın:
```bash
npm run dev
```

Frontend http://localhost:3001 adresinde çalışacaktır.

## Kullanım

1. Backend ve frontend'i ayrı terminal pencerelerinde çalıştırın
2. Frontend'de kayıt olun veya giriş yapın
3. Hikaye oluşturun, düzenleyin ve paylaşın
4. Harita üzerinde hikayelerin konumlarını görüntüleyin
5. Admin rolü ile yönetim panelinden tüm içerikleri yönetin

## Teknik Detaylar

### Backend Endpoint'leri

- **Auth**: `/auth/login`, `/auth/register`
- **Users**: `/users/*` (CRUD)
- **Stories**: `/stories/*` (CRUD + Like)
- **Categories**: `/categories/*` (CRUD)
- **Comments**: `/comments/*` (CRUD + Like)
- **Upload**: `/upload/photo`

Tüm endpoint'ler Swagger UI'da dokümante edilmiştir.

### Frontend Sayfaları

- `/` - Ana sayfa
- `/login` - Giriş
- `/register` - Kayıt
- `/stories` - Hikaye listesi
- `/stories/:id` - Hikaye detayı
- `/my-stories` - Kullanıcının hikayeleri
- `/create-story` - Hikaye oluştur
- `/edit-story/:id` - Hikaye düzenle
- `/admin` - Yönetim paneli (Admin/SuperAdmin)

## Geliştirme Notları

- Backend'de tüm endpoint'ler yorum satırları ile açıklanmıştır
- Frontend'de tüm component'ler görevleri ile yorumlanmıştır
- Kod yapısı modüler ve temiz tutulmuştur
- SOLID prensipleri ve Clean Architecture yaklaşımı uygulanmıştır

## Lisans

MIT

