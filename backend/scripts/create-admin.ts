import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UsersModule } from '../src/users/users.module';
import * as bcrypt from 'bcrypt';

/**
 * Admin Kullanıcı Oluşturma Script'i
 * Admin rolünde kullanıcı oluşturur
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.select(UsersModule).get(UsersService, { strict: true });

  // Komut satırı argümanlarından bilgileri al
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@example.com';
  const username = args[1] || 'admin';
  const password = args[2] || 'admin123';
  const firstName = args[3] || 'Admin';
  const lastName = args[4] || 'User';

  try {
    // Mevcut kullanıcı kontrolü
    const existingUser = await usersService.findByEmail(email);
    if (existingUser) {
      console.log(`⚠️  Bu e-posta adresi (${email}) zaten kullanılıyor.`);
      await app.close();
      process.exit(1);
    }

    const existingUsername = await usersService.findByUsername(username);
    if (existingUsername) {
      console.log(`⚠️  Bu kullanıcı adı (${username}) zaten kullanılıyor.`);
      await app.close();
      process.exit(1);
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Admin kullanıcı oluştur
    const admin = await usersService.create({
      email,
      username,
      password: hashedPassword,
      role: 'Admin',
      firstName,
      lastName,
      isActive: true,
    });

    console.log('✅ Admin kullanıcısı başarıyla oluşturuldu!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🎭 Role: Admin`);
    
    await app.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Hata:', error.message);
    await app.close();
    process.exit(1);
  }
}

bootstrap();





