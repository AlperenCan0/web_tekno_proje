import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { User, Profile, Story, Category, Comment } from '../entities';

/**
 * Seed Module - Veritabanı seed işlemleri için modül
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Story, Category, Comment]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

