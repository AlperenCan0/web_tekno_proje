import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { Story } from '../entities/story.entity';
import { Category } from '../entities/category.entity';

/**
 * Stories Module - Hikaye yönetimi modülü
 * Story entity'sini ve kategori ilişkilerini yönetir
 */
@Module({
  imports: [TypeOrmModule.forFeature([Story, Category])],
  controllers: [StoriesController],
  providers: [StoriesService],
  exports: [StoriesService],
})
export class StoriesModule {}

