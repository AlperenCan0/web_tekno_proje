import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoriesModule } from './stories/stories.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { UploadModule } from './upload/upload.module';
import { SeedModule } from './seed/seed.module';
import { User, Profile, Story, Category, Comment } from './entities';

/**
 * Ana uygulama modülü
 * Tüm modülleri ve veritabanı bağlantısını yapılandırır
 */
@Module({
  imports: [
    // Environment variables yapılandırması
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // SQLite veritabanı bağlantısı
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_DATABASE || './database.sqlite',
      entities: [User, Profile, Story, Category, Comment],
      synchronize: process.env.NODE_ENV !== 'production', // Production'da false olmalı
      logging: process.env.NODE_ENV === 'development',
    }),
    // Feature modülleri
    AuthModule,
    UsersModule,
    StoriesModule,
    CategoriesModule,
    CommentsModule,
    UploadModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

