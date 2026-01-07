# Seed İşlemi - Örnek Veriler Yükleme

Veritabanına örnek veriler yüklemek için iki yöntem var:

## Yöntem 1: API Endpoint ile (Önerilen)

1. Önce bir SuperAdmin kullanıcısı oluşturun (ilk kayıt):
   - Frontend'de kayıt olun veya
   - Swagger UI'dan `/auth/register` endpoint'ini kullanın
   - Sonra bir Admin/SuperAdmin kullanıcısını manuel olarak SuperAdmin rolüne güncelleyin

2. SuperAdmin olarak giriş yapın ve token alın

3. Swagger UI'dan veya Postman ile:
   - `POST /seed` endpoint'ini çağırın
   - Authorization header'ına `Bearer <token>` ekleyin

## Yöntem 2: Manuel Olarak

Backend çalışırken, Swagger UI'dan veya Postman ile:

1. `/auth/register` ile bir kullanıcı oluşturun
2. Veritabanından bu kullanıcıyı SuperAdmin yapın
3. `/seed` endpoint'ini çağırın

## Oluşturulacak Veriler

- **4 Kullanıcı**: admin, superadmin, hikayecim, yerelgezgin
- **5 Kategori**: Tarihi Yerler, Doğa, Kültür, Yemek, Eğlence
- **5 Hikaye**: İstanbul Boğazı, Kapadokya, Antalya Kaleiçi, Bursa Çarşı, Pamukkale
- **4 Yorum**: Hikayelere yapılmış örnek yorumlar

## Test Kullanıcıları

- **SuperAdmin**: superadmin@example.com / superadmin123
- **Admin**: admin@example.com / admin123
- **User 1**: user1@example.com / user123
- **User 2**: user2@example.com / user123

