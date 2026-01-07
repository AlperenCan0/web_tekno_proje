# Seed İşlemi - Hızlı Başlangıç

## Yöntem: API Endpoint ile Seed

Backend çalışırken (http://localhost:3000):

### Adım 1: İlk Kullanıcıyı Oluşturun

Swagger UI (http://localhost:3000/api) veya Postman ile:

```http
POST /auth/register
Content-Type: application/json

{
  "email": "superadmin@example.com",
  "username": "superadmin",
  "password": "superadmin123",
  "firstName": "Super",
  "lastName": "Admin"
}
```

### Adım 2: Kullanıcıyı SuperAdmin Yapın

SQLite veritabanını açın ve kullanıcıyı SuperAdmin yapın:

```sql
UPDATE users SET role = 'SuperAdmin' WHERE email = 'superadmin@example.com';
```

Veya backend çalışırken Swagger UI'dan `/users/:id` endpoint'ini kullanarak güncelleyin (eğer başka bir Admin varsa).

### Adım 3: SuperAdmin ile Giriş Yapın

```http
POST /auth/login
Content-Type: application/json

{
  "email": "superadmin@example.com",
  "password": "superadmin123"
}
```

Token'ı kopyalayın.

### Adım 4: Seed İşlemini Çalıştırın

```http
POST /seed
Authorization: Bearer <token>
```

## Oluşturulacak Veriler

- **4 Kullanıcı**: admin, superadmin, hikayecim, yerelgezgin
- **5 Kategori**: Tarihi Yerler, Doğa, Kültür, Yemek, Eğlence  
- **5 Hikaye**: İstanbul Boğazı, Kapadokya, Antalya Kaleiçi, Bursa Çarşı, Pamukkale
- **4 Yorum**: Hikayelere yapılmış örnek yorumlar

## Test Kullanıcıları (Seed sonrası)

- **SuperAdmin**: superadmin@example.com / superadmin123
- **Admin**: admin@example.com / admin123
- **User 1**: user1@example.com / user123
- **User 2**: user2@example.com / user123

