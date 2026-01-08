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
import { User, Profile, Story, StoryLike, Category, Comment } from './entities';

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
    // PostgreSQL veritabanı bağlantısı
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'local_stories',
      entities: [User, Profile, Story, StoryLike, Category, Comment],
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
export class AppModule { }

