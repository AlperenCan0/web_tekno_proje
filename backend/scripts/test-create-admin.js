/**
 * Admin Oluşturma Test Script'i
 * Backend çalışırken bu script'i çalıştırarak admin oluşturabilirsiniz
 */

const http = require('http');

const adminData = {
  email: 'admin@example.com',
  username: 'admin',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'User'
};

const postData = JSON.stringify(adminData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/auth/create-admin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 201) {
      console.log('✅ Admin başarıyla oluşturuldu!');
      console.log('📧 Email:', adminData.email);
      console.log('👤 Username:', adminData.username);
      console.log('🔑 Password:', adminData.password);
      console.log('🎭 Role: Admin');
      console.log('\n📝 Response:', JSON.parse(data));
    } else {
      console.error('❌ Hata:', res.statusCode);
      console.error('📝 Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Bağlantı hatası:', error.message);
  console.error('💡 Backend\'in çalıştığından emin olun: npm run start:dev');
});

req.write(postData);
req.end();

