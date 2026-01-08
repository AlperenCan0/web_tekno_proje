import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseService } from '../common/base.service';
import { Story } from '../entities/story.entity';
import { StoryLike } from '../entities/story-like.entity';
import { Category } from '../entities/category.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { LikeStoryDto } from './dto/like-story.dto';

@Injectable()
export class StoriesService extends BaseService<Story> {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    @InjectRepository(StoryLike)
    private storyLikesRepository: Repository<StoryLike>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {
    super();
  }

  async create(createStoryDto: CreateStoryDto, authorId: string): Promise<Story> {
    const { categoryIds, ...storyData } = createStoryDto;

    console.log('📸 Story oluşturuluyor - Photos:', createStoryDto.photos);

    const story = this.storiesRepository.create({
      ...storyData,
      authorId,
    });

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoriesRepository.findBy({
        id: In(categoryIds),
      });
      story.categories = categories;
    }

    return this.storiesRepository.save(story);
  }

  async findAll(publishedOnly: boolean = true): Promise<Story[]> {
    const where: any = {};
    if (publishedOnly) {
      where.isPublished = true;
    }

    return this.storiesRepository.find({
      where,
      relations: ['author', 'author.profile', 'categories', 'comments', 'comments.author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Story> {
    return this.findOneOrFail(
      this.storiesRepository,
      id,
      'hikaye',
      ['author', 'author.profile', 'categories', 'comments', 'comments.author'],
    );
  }

  async findByAuthor(authorId: string): Promise<Story[]> {
    return this.storiesRepository.find({
      where: { authorId },
      relations: ['categories', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateStoryDto: UpdateStoryDto, userId: string, userRole: string): Promise<Story> {
    const story = await this.findOne(id);

    this.checkOwnership(story, userId, userRole, 'Bu hikayeyi güncelleme yetkiniz yok');

    if (updateStoryDto.categoryIds) {
      const categories = await this.categoriesRepository.findBy({
        id: In(updateStoryDto.categoryIds),
      });
      story.categories = categories;
      delete updateStoryDto.categoryIds;
    }

    Object.assign(story, updateStoryDto);
    return this.storiesRepository.save(story);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const story = await this.findOne(id);

    this.checkOwnership(story, userId, userRole, 'Bu hikayeyi silme yetkiniz yok');

    await this.storiesRepository.remove(story);
  }

  async likeStory(id: string, likeStoryDto: LikeStoryDto, userId: string): Promise<{ story: Story; userAction: string | null }> {
    const story = await this.findOne(id);

    const existingLike = await this.storyLikesRepository.findOne({
      where: { storyId: id, userId },
    });

    if (existingLike) {
      if (existingLike.action === likeStoryDto.action) {
        if (existingLike.action === 'like') {
          story.likes = Math.max(0, story.likes - 1);
        } else {
          story.dislikes = Math.max(0, story.dislikes - 1);
        }

        await this.storyLikesRepository.remove(existingLike);
        await this.storiesRepository.save(story);

        return { story, userAction: null };
      } else {
        if (existingLike.action === 'like') {
          story.likes = Math.max(0, story.likes - 1);
        } else {
          story.dislikes = Math.max(0, story.dislikes - 1);
        }

        if (likeStoryDto.action === 'like') {
          story.likes += 1;
        } else {
          story.dislikes += 1;
        }

        existingLike.action = likeStoryDto.action;
        await this.storyLikesRepository.save(existingLike);
        await this.storiesRepository.save(story);

        return { story, userAction: likeStoryDto.action };
      }
    } else {
      const newLike = this.storyLikesRepository.create({
        userId,
        storyId: id,
        action: likeStoryDto.action,
      });

      if (likeStoryDto.action === 'like') {
        story.likes += 1;
      } else {
        story.dislikes += 1;
      }

      await this.storyLikesRepository.save(newLike);
      await this.storiesRepository.save(story);

      return { story, userAction: likeStoryDto.action };
    }
  }

  async getUserLikeStatus(storyId: string, userId: string): Promise<string | null> {
    const like = await this.storyLikesRepository.findOne({
      where: { storyId, userId },
    });
    return like ? like.action : null;
  }
}
