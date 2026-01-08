# Yerel Hikaye Paylaşım Platformu

Kullanıcıların yerel hikayelerini paylaşabildiği, harita üzerinde konumlandırabildiği web uygulaması.

## Gereksinimler

- Node.js (v18+)
- PostgreSQL

## Kurulum

### 1. Veritabanı

PostgreSQL'de `local_stories` adında bir veritabanı oluşturun.

### 2. Backend

```bash
cd backend
cp .env.example .env
# .env dosyasını düzenleyin (DB_PASSWORD vb.)
npm install
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 4. Admin Oluşturma

```bash
cd backend
npx ts-node scripts/create-superadmin.ts
```

**Varsayılan Admin:**
- Email: superadmin@example.com
- Şifre: superadmin123

## Erişim

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger: http://localhost:3000/api
