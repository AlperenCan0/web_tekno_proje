# Yerel Hikaye Paylaşım Platformu - Backend

NestJS tabanlı RESTful API backend uygulaması.

## Teknolojiler

- **NestJS** - Node.js framework
- **SQLite** - Veritabanı (better-sqlite3)
- **TypeORM** - ORM
- **JWT** - Kimlik doğrulama
- **Swagger** - API dokümantasyonu
- **Multer** - Dosya yükleme

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun (opsiyonel - varsayılan değerler kullanılır):
```env
DB_DATABASE=./database.sqlite
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
UPLOAD_DEST=./uploads
```

3. Uygulamayı çalıştırın:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

**Not**: SQLite veritabanı dosyası (`database.sqlite`) otomatik olarak oluşturulacaktır.

## API Dokümantasyonu

Uygulama çalıştıktan sonra Swagger UI'a şu adresten erişebilirsiniz:
- http://localhost:3000/api

## Veri Modeli

### Entity'ler ve İlişkiler

1. **User & Profile** (One-to-One)
   - User: Kullanıcı temel bilgileri
   - Profile: Kullanıcı detaylı profil bilgileri

2. **User & Story** (One-to-Many)
   - Bir kullanıcı birden fazla hikaye paylaşabilir

3. **Story & Category** (Many-to-Many)
   - Bir hikaye birden fazla kategoride olabilir
   - Bir kategoride çokça hikaye bulunabilir

4. **Story & Comment** (One-to-Many)
   - Bir hikayeye birden fazla yorum yapılabilir

## Roller

- **User**: Normal kullanıcı
- **Admin**: Yönetici (kategori yönetimi, tüm hikayeleri görme)
- **SuperAdmin**: Süper yönetici (tüm yetkiler)

## Endpoint'ler

### Auth
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi

### Users
- `GET /users` - Tüm kullanıcılar (Admin/SuperAdmin)
- `GET /users/me` - Mevcut kullanıcı bilgileri
- `GET /users/:id` - Kullanıcı detayı
- `PATCH /users/:id` - Kullanıcı güncelleme
- `DELETE /users/:id` - Kullanıcı silme (Admin/SuperAdmin)

### Stories
- `GET /stories` - Tüm hikayeler
- `GET /stories/my` - Kullanıcının hikayeleri
- `GET /stories/:id` - Hikaye detayı
- `POST /stories` - Yeni hikaye oluştur
- `PATCH /stories/:id` - Hikaye güncelle
- `DELETE /stories/:id` - Hikaye sil
- `POST /stories/:id/like` - Hikayeyi beğen/beğenme

### Categories
- `GET /categories` - Tüm kategoriler
- `GET /categories/:id` - Kategori detayı
- `POST /categories` - Yeni kategori (Admin/SuperAdmin)
- `PATCH /categories/:id` - Kategori güncelle (Admin/SuperAdmin)
- `DELETE /categories/:id` - Kategori sil (Admin/SuperAdmin)

### Comments
- `GET /comments` - Tüm yorumlar
- `GET /comments/:id` - Yorum detayı
- `POST /comments` - Yeni yorum oluştur
- `PATCH /comments/:id` - Yorum güncelle
- `DELETE /comments/:id` - Yorum sil
- `POST /comments/:id/like` - Yorumu beğen/beğenme

### Upload
- `POST /upload/photo` - Fotoğraf yükle

## Notlar

- Tüm endpoint'ler Swagger UI'da dokümante edilmiştir
- JWT token ile korumalı endpoint'ler için `Authorization: Bearer <token>` header'ı gereklidir
- Fotoğraflar `./uploads` klasörüne kaydedilir ve `/uploads` endpoint'i üzerinden erişilebilir
- SQLite veritabanı dosyası (`database.sqlite`) proje kök dizininde oluşturulur
- Development modunda `synchronize: true` olduğu için veritabanı şeması otomatik oluşturulur
