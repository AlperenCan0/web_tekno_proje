# Yerel Hikaye Paylaşım Platformu

NestJS (Backend) ve React (Frontend) kullanılarak geliştirilmiş yerel hikaye paylaşım platformu.

## 📋 Gereksinimler

- **Node.js** v18 veya üzeri
- **PostgreSQL** v14 veya üzeri
- **npm** veya **yarn**

## 🚀 Hızlı Kurulum

### 1. PostgreSQL Veritabanı Oluşturma

1. PostgreSQL'i kurun ve çalıştırın
2. pgAdmin veya psql ile bağlanın
3. `local_stories` adında yeni bir veritabanı oluşturun:
```sql
CREATE DATABASE local_stories;
```

### 2. Backend Kurulumu

```bash
# Backend klasörüne gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env

# .env dosyasını düzenleyin ve veritabanı bilgilerinizi girin
# DB_PASSWORD=your_postgres_password
# JWT_SECRET=your_secret_key

# Uygulamayı başlatın
npm run start:dev
```

Backend http://localhost:3000 adresinde çalışacaktır.

### 3. SuperAdmin Oluşturma

```bash
# Backend klasöründe
npx ts-node scripts/create-superadmin.ts
```

Bu komut aşağıdaki bilgilerle SuperAdmin oluşturur:
- **Email:** superadmin@example.com
- **Şifre:** superadmin123

⚠️ **Önemli:** Productionda bu bilgileri değiştirin!

### 4. Frontend Kurulumu

```bash
# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env

# Uygulamayı başlatın
npm run dev
```

Frontend http://localhost:5173 adresinde çalışacaktır.

## 📁 Proje Yapısı

```
.
├── backend/          # NestJS backend uygulaması
│   ├── src/          # Kaynak kodlar
│   ├── scripts/      # Seed ve yardımcı scriptler
│   └── uploads/      # Yüklenen dosyalar (veritabanında saklanır)
├── frontend/         # React frontend uygulaması
│   └── src/          # Kaynak kodlar
└── README.md         # Bu dosya
```

## ✨ Özellikler

### Backend (NestJS)
- ✅ PostgreSQL + TypeORM ile veritabanı yönetimi
- ✅ JWT tabanlı kimlik doğrulama ve yetkilendirme
- ✅ 3 rol sistemi: User, Admin, SuperAdmin
- ✅ Fotoğraflar veritabanında saklanır (kaybolma riski yok)
- ✅ Swagger UI ile API dokümantasyonu
- ✅ Like/Dislike sistemi

### Frontend (React)
- ✅ React Router ile sayfa yönetimi
- ✅ Context API ile state yönetimi
- ✅ Rol tabanlı UI ve routing
- ✅ Tailwind CSS ile modern tasarım
- ✅ Responsive tasarım

## 👥 Rol Sistemi

| Rol | Yetkiler |
|-----|----------|
| **User** | Hikaye oluşturma, yorum yapma, beğenme |
| **Admin** | User yetkilerinin hepsine sahip + sadece User oluşturabilir |
| **SuperAdmin** | Tüm yetkiler + Admin oluşturabilir |

## 🔗 API Endpoint'leri

- **Swagger UI:** http://localhost:3000/api
- **Auth:** `/auth/login`, `/auth/register`
- **Users:** `/users/*` (CRUD)
- **Stories:** `/stories/*` (CRUD + Like)
- **Categories:** `/categories/*` (CRUD)
- **Comments:** `/comments/*` (CRUD + Like)
- **Upload:** `/upload/photo`, `/upload/view/:filename`

## 📱 Frontend Sayfaları

| Sayfa | URL | Erişim |
|-------|-----|--------|
| Ana Sayfa | `/` | Herkes |
| Giriş | `/login` | Herkes |
| Kayıt | `/register` | Herkes |
| Hikayeler | `/stories` | Herkes |
| Hikaye Detay | `/stories/:id` | Herkes |
| Hikayelerim | `/my-stories` | Giriş yapmış |
| Hikaye Oluştur | `/create-story` | Giriş yapmış |
| Yönetim Paneli | `/admin` | Admin/SuperAdmin |

## 🛠️ Geliştirme

```bash
# Backend'i development modda çalıştır
cd backend && npm run start:dev

# Frontend'i development modda çalıştır
cd frontend && npm run dev
```

## 📝 Lisans

MIT
