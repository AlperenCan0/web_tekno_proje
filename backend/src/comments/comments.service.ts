import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/base.service';
import { Comment } from '../entities/comment.entity';
import { CommentLike } from '../entities/comment-like.entity';
import { Story } from '../entities/story.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LikeCommentDto } from './dto/like-comment.dto';

@Injectable()
export class CommentsService extends BaseService<Comment> {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private commentLikesRepository: Repository<CommentLike>,
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
  ) {
    super();
  }

  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    const story = await this.storiesRepository.findOne({
      where: { id: createCommentDto.storyId },
    });

    if (!story) {
      throw new NotFoundException(`ID ${createCommentDto.storyId} ile hikaye bulunamadı`);
    }

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      authorId,
    });

    return this.commentsRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['author', 'author.profile', 'story'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    return this.findOneOrFail(
      this.commentsRepository,
      id,
      'yorum',
      ['author', 'author.profile', 'story'],
    );
  }

  async findByStory(storyId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { storyId },
      relations: ['author', 'author.profile'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string, userRole: string): Promise<Comment> {
    const comment = await this.findOne(id);

    this.checkOwnership(comment, userId, userRole, 'Bu yorumu güncelleme yetkiniz yok');

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const comment = await this.findOne(id);

    this.checkOwnership(comment, userId, userRole, 'Bu yorumu silme yetkiniz yok');

    await this.commentsRepository.remove(comment);
  }

  async likeComment(id: string, likeCommentDto: LikeCommentDto, userId: string): Promise<{ comment: Comment; userAction: string | null }> {
    const comment = await this.findOne(id);

    const existingLike = await this.commentLikesRepository.findOne({
      where: { commentId: id, userId },
    });

    if (existingLike) {
      if (existingLike.action === likeCommentDto.action) {
        if (existingLike.action === 'like') {
          comment.likes = Math.max(0, comment.likes - 1);
        } else {
          comment.dislikes = Math.max(0, comment.dislikes - 1);
        }

        await this.commentLikesRepository.remove(existingLike);
        await this.commentsRepository.save(comment);

        return { comment, userAction: null };
      } else {
        if (existingLike.action === 'like') {
          comment.likes = Math.max(0, comment.likes - 1);
        } else {
          comment.dislikes = Math.max(0, comment.dislikes - 1);
        }

        if (likeCommentDto.action === 'like') {
          comment.likes += 1;
        } else {
          comment.dislikes += 1;
        }

        existingLike.action = likeCommentDto.action;
        await this.commentLikesRepository.save(existingLike);
        await this.commentsRepository.save(comment);

        return { comment, userAction: likeCommentDto.action };
      }
    } else {
      const newLike = this.commentLikesRepository.create({
        userId,
        commentId: id,
        action: likeCommentDto.action,
      });

      if (likeCommentDto.action === 'like') {
        comment.likes += 1;
      } else {
        comment.dislikes += 1;
      }

      await this.commentLikesRepository.save(newLike);
      await this.commentsRepository.save(comment);

      return { comment, userAction: likeCommentDto.action };
    }
  }

  async getUserLikeStatus(commentId: string, userId: string): Promise<string | null> {
    const like = await this.commentLikesRepository.findOne({
      where: { commentId, userId },
    });
    return like ? like.action : null;
  }
}
