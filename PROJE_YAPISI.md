# Proje Yapısı ve Açıklamalar

Bu dokümanda projenin yapısı ve her dosyanın görevi açıklanmaktadır.

## Backend Yapısı

### Entities (Veri Modelleri)

#### `src/entities/user.entity.ts`
- **Görev**: Kullanıcı temel bilgilerini tutar
- **İlişkiler**: 
  - One-to-One: Profile
  - One-to-Many: Story, Comment
- **Alanlar**: email, username, password, role, isActive

#### `src/entities/profile.entity.ts`
- **Görev**: Kullanıcı detaylı profil bilgilerini tutar
- **İlişkiler**: One-to-One: User
- **Alanlar**: firstName, lastName, bio, avatar, phone, location

#### `src/entities/story.entity.ts`
- **Görev**: Yerel hikayeleri tutar
- **İlişkiler**: 
  - Many-to-One: User (author)
  - Many-to-Many: Category
  - One-to-Many: Comment
- **Alanlar**: title, content, latitude, longitude, locationName, photos, likes, dislikes

#### `src/entities/category.entity.ts`
- **Görev**: Hikaye kategorilerini tutar
- **İlişkiler**: Many-to-Many: Story
- **Alanlar**: name, description, icon

#### `src/entities/comment.entity.ts`
- **Görev**: Hikayelere yapılan yorumları tutar
- **İlişkiler**: 
  - Many-to-One: User (author), Story
- **Alanlar**: content, likes, dislikes

### Auth Modülü

#### `src/auth/auth.service.ts`
- **Görev**: Kimlik doğrulama işlemlerini yönetir
- **Fonksiyonlar**: 
  - `register()`: Kullanıcı kaydı, şifre hash'leme, JWT token oluşturma
  - `login()`: Kullanıcı girişi, şifre doğrulama, JWT token oluşturma

#### `src/auth/auth.controller.ts`
- **Görev**: Auth endpoint'lerini yönetir
- **Endpoint'ler**:
  - `POST /auth/register`: Yeni kullanıcı kaydı
  - `POST /auth/login`: Kullanıcı girişi

#### `src/auth/strategies/jwt.strategy.ts`
- **Görev**: JWT token doğrulama stratejisi
- **Fonksiyon**: Token'dan kullanıcı bilgilerini çıkarır ve doğrular

#### `src/auth/guards/jwt-auth.guard.ts`
- **Görev**: JWT token ile korumalı endpoint'ler için guard
- **Kullanım**: `@UseGuards(JwtAuthGuard)` decorator'ü ile

#### `src/auth/guards/roles.guard.ts`
- **Görev**: Rol tabanlı yetkilendirme guard'ı
- **Kullanım**: `@UseGuards(RolesGuard)` ve `@Roles()` decorator'leri ile

### CRUD Modülleri

#### Users Modülü
- **Service**: `src/users/users.service.ts` - Kullanıcı CRUD işlemleri
- **Controller**: `src/users/users.controller.ts` - Kullanıcı endpoint'leri
- **Endpoint'ler**:
  - `GET /users` - Tüm kullanıcılar (Admin/SuperAdmin)
  - `GET /users/me` - Mevcut kullanıcı
  - `GET /users/:id` - Kullanıcı detayı
  - `PATCH /users/:id` - Kullanıcı güncelle
  - `DELETE /users/:id` - Kullanıcı sil (Admin/SuperAdmin)

#### Stories Modülü
- **Service**: `src/stories/stories.service.ts` - Hikaye CRUD işlemleri, like/dislike
- **Controller**: `src/stories/stories.controller.ts` - Hikaye endpoint'leri
- **Endpoint'ler**:
  - `GET /stories` - Tüm hikayeler
  - `GET /stories/my` - Kullanıcının hikayeleri
  - `GET /stories/:id` - Hikaye detayı
  - `POST /stories` - Yeni hikaye
  - `PATCH /stories/:id` - Hikaye güncelle
  - `DELETE /stories/:id` - Hikaye sil
  - `POST /stories/:id/like` - Hikayeyi beğen/beğenme

#### Categories Modülü
- **Service**: `src/categories/categories.service.ts` - Kategori CRUD işlemleri
- **Controller**: `src/categories/categories.controller.ts` - Kategori endpoint'leri
- **Endpoint'ler**:
  - `GET /categories` - Tüm kategoriler
  - `GET /categories/:id` - Kategori detayı
  - `POST /categories` - Yeni kategori (Admin/SuperAdmin)
  - `PATCH /categories/:id` - Kategori güncelle (Admin/SuperAdmin)
  - `DELETE /categories/:id` - Kategori sil (Admin/SuperAdmin)

#### Comments Modülü
- **Service**: `src/comments/comments.service.ts` - Yorum CRUD işlemleri, like/dislike
- **Controller**: `src/comments/comments.controller.ts` - Yorum endpoint'leri
- **Endpoint'ler**:
  - `GET /comments` - Tüm yorumlar
  - `GET /comments/:id` - Yorum detayı
  - `POST /comments` - Yeni yorum
  - `PATCH /comments/:id` - Yorum güncelle
  - `DELETE /comments/:id` - Yorum sil
  - `POST /comments/:id/like` - Yorumu beğen/beğenme

#### Upload Modülü
- **Controller**: `src/upload/upload.controller.ts` - Fotoğraf yükleme
- **Endpoint**:
  - `POST /upload/photo` - Fotoğraf yükle (JWT gerekli)

### Ana Dosyalar

#### `src/main.ts`
- **Görev**: Uygulama giriş noktası
- **Yapılandırma**: CORS, Validation Pipe, Swagger

#### `src/app.module.ts`
- **Görev**: Ana uygulama modülü
- **Yapılandırma**: Tüm modülleri import eder, TypeORM bağlantısı

## Frontend Yapısı

### Context API

#### `src/contexts/AuthContext.tsx`
- **Görev**: Global authentication state yönetimi
- **Fonksiyonlar**:
  - `login()`: Kullanıcı girişi, token kaydetme
  - `register()`: Kullanıcı kaydı, token kaydetme
  - `logout()`: Kullanıcı çıkışı, token temizleme
- **State**: user, token, isAuthenticated, isAdmin, isSuperAdmin

### Components

#### `src/components/Navbar.tsx`
- **Görev**: Ana navigasyon menüsü
- **Özellikler**: Rol tabanlı menü gösterimi, Admin paneli linki

#### `src/components/ProtectedRoute.tsx`
- **Görev**: Giriş yapmış kullanıcılar için korumalı route
- **Kullanım**: Giriş yapmamış kullanıcıları login sayfasına yönlendirir

#### `src/components/AdminRoute.tsx`
- **Görev**: Admin/SuperAdmin için korumalı route
- **Kullanım**: Admin olmayan kullanıcıları ana sayfaya yönlendirir

#### `src/components/StoryMap.tsx`
- **Görev**: Google Maps ile hikaye konumlarını gösterir
- **Özellikler**: Marker'lar, tıklanabilir marker'lar

### Pages

#### `src/pages/Login.tsx`
- **Görev**: Kullanıcı giriş sayfası
- **Form**: Email, password

#### `src/pages/Register.tsx`
- **Görev**: Kullanıcı kayıt sayfası
- **Form**: Email, username, password, firstName, lastName

#### `src/pages/Home.tsx`
- **Görev**: Ana sayfa
- **İçerik**: Platform tanıtımı, hızlı erişim linkleri

#### `src/pages/Stories.tsx`
- **Görev**: Tüm hikayeleri listeler
- **Özellikler**: Liste/harita görünümü, kategori filtresi, like/dislike

#### `src/pages/StoryDetail.tsx`
- **Görev**: Hikaye detay sayfası
- **İçerik**: Hikaye içeriği, fotoğraflar, yorumlar, harita

#### `src/pages/MyStories.tsx`
- **Görev**: Kullanıcının hikayelerini listeler
- **Özellikler**: Düzenle, sil butonları

#### `src/pages/CreateStory.tsx`
- **Görev**: Yeni hikaye oluşturma sayfası
- **Form**: Başlık, içerik, koordinatlar, kategoriler, fotoğraflar

#### `src/pages/EditStory.tsx`
- **Görev**: Hikaye düzenleme sayfası
- **Form**: Mevcut hikaye bilgilerini güncelleme

#### `src/pages/AdminPanel.tsx`
- **Görev**: Yönetim paneli (Admin/SuperAdmin)
- **Sekmeler**: Kullanıcılar, Kategoriler, Hikayeler

### Services

#### `src/services/api.ts`
- **Görev**: Backend API ile iletişim fonksiyonları
- **API'ler**: storiesApi, commentsApi, categoriesApi, usersApi, uploadApi

### Types

#### `src/types/index.ts`
- **Görev**: TypeScript tip tanımlamaları
- **Tipler**: User, Profile, Story, Category, Comment

## Önemli Notlar

1. **Backend**: Tüm endpoint'ler Swagger UI'da dokümante edilmiştir
2. **Frontend**: Tüm component'ler görevleri ile yorumlanmıştır
3. **Güvenlik**: JWT token ile korumalı endpoint'ler
4. **Rol Sistemi**: User, Admin, SuperAdmin rolleri
5. **Harita**: Google Maps API entegrasyonu
6. **Dosya Yükleme**: Multer ile fotoğraf yükleme

