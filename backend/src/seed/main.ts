import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

/**
 * Seed Script Main - Veritabanına örnek veriler yükler
 * Çalıştırma: npm run seed
 */
async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seedService = app.select(SeedModule).get(SeedService, { strict: true });
    
    await seedService.seed();
    
    await app.close();
    console.log('✅ Seed işlemi başarıyla tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed işlemi sırasında hata oluştu:', error);
    process.exit(1);
  }
}

bootstrap();

