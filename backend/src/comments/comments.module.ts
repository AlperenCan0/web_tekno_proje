import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from '../entities/comment.entity';
import { CommentLike } from '../entities/comment-like.entity';
import { Story } from '../entities/story.entity';

/**
 * Comments Module - Yorum yönetimi modülü
 * Comment ve CommentLike entity'lerini yönetir
 */
@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentLike, Story])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}

