import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UsersModule } from '../src/users/users.module';

/**
 * SuperAdmin Oluşturma Script'i
 * İlk SuperAdmin kullanıcısını oluşturur
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.select(UsersModule).get(UsersService, { strict: true });

  try {
    // SuperAdmin oluştur
    const superAdmin = await usersService.create({
      email: 'superadmin@example.com',
      username: 'superadmin',
      password: 'superadmin123',
      role: 'SuperAdmin',
      firstName: 'Super',
      lastName: 'Admin',
    });

    console.log('✅ SuperAdmin kullanıcısı oluşturuldu!');
    console.log('Email: superadmin@example.com');
    console.log('Password: superadmin123');
    
    await app.close();
    process.exit(0);
  } catch (error: any) {
    if (error.message?.includes('zaten kullanılıyor')) {
      console.log('ℹ️  SuperAdmin kullanıcısı zaten mevcut.');
    } else {
      console.error('❌ Hata:', error.message);
    }
    await app.close();
    process.exit(1);
  }
}

bootstrap();

