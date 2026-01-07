/**
 * Seed Script - JavaScript versiyonu
 * Doğrudan çalıştırılabilir: node src/seed/run-seed.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🌱 Seed işlemi başlatılıyor...');
console.log('⚠️  Backend çalışıyor olmalı (http://localhost:3000)');
console.log('');
console.log('Seed işlemini yapmak için:');
console.log('1. Backend\'i başlatın: npm run start:dev');
console.log('2. Swagger UI\'dan (http://localhost:3000/api) veya Postman ile:');
console.log('   - Önce bir kullanıcı kaydedin (/auth/register)');
console.log('   - Bu kullanıcıyı SuperAdmin yapın (veritabanından)');
console.log('   - SuperAdmin olarak giriş yapın (/auth/login)');
console.log('   - Token ile POST /seed endpoint\'ini çağırın');
console.log('');
console.log('Veya manuel olarak seed service\'i kullanın.');

