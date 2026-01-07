import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from '../entities/comment.entity';
import { Story } from '../entities/story.entity';

/**
 * Comments Module - Yorum yönetimi modülü
 * Comment entity'sini yönetir
 */
@Module({
  imports: [TypeOrmModule.forFeature([Comment, Story])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}

