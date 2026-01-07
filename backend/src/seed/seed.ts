import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

/**
 * Seed Script - Veritabanına örnek veriler yükler
 * Çalıştırma: npm run seed veya ts-node src/seed/seed.ts
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.select(SeedModule).get(SeedService, { strict: true });
  
  try {
    await seedService.seed();
    console.log('✅ Seed işlemi başarıyla tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed işlemi sırasında hata oluştu:', error);
    process.exit(1);
  }
}

bootstrap();

