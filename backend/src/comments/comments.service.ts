import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Story } from '../entities/story.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LikeCommentDto } from './dto/like-comment.dto';

/**
 * Comments Service - Yorum işlemlerini yönetir
 * CRUD operasyonları ve like/dislike işlemlerini gerçekleştirir
 */
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
  ) {}

  /**
   * Yeni yorum oluşturur
   * Hikayenin varlığını kontrol eder
   */
  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    // Hikayenin varlığını kontrol et
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

  /**
   * Tüm yorumları getirir
   * İlişkili verilerle birlikte (author, story)
   */
  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['author', 'author.profile', 'story'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * ID'ye göre yorum getirir
   */
  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'author.profile', 'story'],
    });

    if (!comment) {
      throw new NotFoundException(`ID ${id} ile yorum bulunamadı`);
    }

    return comment;
  }

  /**
   * Hikayeye ait yorumları getirir
   */
  async findByStory(storyId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { storyId },
      relations: ['author', 'author.profile'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Yorum bilgilerini günceller
   * Sadece yorum sahibi veya Admin/SuperAdmin güncelleyebilir
   */
  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string, userRole: string): Promise<Comment> {
    const comment = await this.findOne(id);

    // Yetki kontrolü
    if (userRole === 'User' && comment.authorId !== userId) {
      throw new ForbiddenException('Bu yorumu güncelleme yetkiniz yok');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  /**
   * Yorumu siler
   * Sadece yorum sahibi veya Admin/SuperAdmin silebilir
   */
  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const comment = await this.findOne(id);

    // Yetki kontrolü
    if (userRole === 'User' && comment.authorId !== userId) {
      throw new ForbiddenException('Bu yorumu silme yetkiniz yok');
    }

    await this.commentsRepository.remove(comment);
  }

  /**
   * Yorumu beğenir veya beğenmez
   * Like/dislike sayısını artırır
   */
  async likeComment(id: string, likeCommentDto: LikeCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);

    if (likeCommentDto.action === 'like') {
      comment.likes += 1;
    } else {
      comment.dislikes += 1;
    }

    return this.commentsRepository.save(comment);
  }
}

