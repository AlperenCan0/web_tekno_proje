# Admin Kullanıcı Oluşturma Rehberi

## Yöntem 1: Swagger UI (Önerilen)

1. Backend'i çalıştırın:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Tarayıcıda Swagger UI'ı açın:
   ```
   http://localhost:3000/api
   ```

3. `POST /auth/create-admin` endpoint'ini bulun

4. "Try it out" butonuna tıklayın

5. Request body'yi doldurun:
   ```json
   {
     "email": "admin@example.com",
     "username": "admin",
     "password": "admin123",
     "firstName": "Admin",
     "lastName": "User"
   }
   ```

6. "Execute" butonuna tıklayın

7. Başarılı olursa admin oluşturulur ve JWT token döner

## Yöntem 2: Node.js Script

1. Backend'in çalıştığından emin olun

2. Script'i çalıştırın:
   ```bash
   cd backend
   npm run create-admin
   ```

## Yöntem 3: cURL

```bash
curl -X POST http://localhost:3000/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

## Yöntem 4: Postman

1. Method: `POST`
2. URL: `http://localhost:3000/auth/create-admin`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "email": "admin@example.com",
     "username": "admin",
     "password": "admin123",
     "firstName": "Admin",
     "lastName": "User"
   }
   ```

## Giriş Yapma

Admin oluşturulduktan sonra:

1. Frontend'de `/login` sayfasına gidin
2. Email: `admin@example.com`
3. Password: `admin123`
4. Giriş yapın

## Önemli Notlar

- ⚠️ Bu endpoint **sadece hiç admin yoksa** çalışır
- ✅ İlk admin oluşturulduktan sonra endpoint devre dışı kalır
- ✅ Sonraki admin'ler mevcut admin tarafından `/users` endpoint'i ile oluşturulmalıdır
- ✅ Admin oluşturulduktan sonra database'de `users` tablosunda `role` kolonu `Admin` olarak görünecektir

## Sorun Giderme

### "Sistemde zaten bir admin kullanıcısı mevcut" hatası
- Database'de zaten bir admin var demektir
- Mevcut admin ile giriş yapın veya database'den admin'i silin

### "Bu e-posta adresi zaten kullanılıyor" hatası
- Farklı bir email kullanın

### "Bu kullanıcı adı zaten kullanılıyor" hatası
- Farklı bir username kullanın

### Database'de admin gözükmüyor
- Backend'in çalıştığından emin olun
- Database bağlantısını kontrol edin
- Endpoint'in başarılı olduğundan emin olun (201 status code)
- Database'i yenileyin/refresh edin

