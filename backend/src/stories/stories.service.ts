import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Story } from '../entities/story.entity';
import { StoryLike } from '../entities/story-like.entity';
import { Category } from '../entities/category.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { LikeStoryDto } from './dto/like-story.dto';

/**
 * Stories Service - Hikaye işlemlerini yönetir
 * CRUD operasyonları, like/dislike ve kategori yönetimi işlemlerini gerçekleştirir
 */
@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    @InjectRepository(StoryLike)
    private storyLikesRepository: Repository<StoryLike>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) { }

  /**
   * Yeni hikaye oluşturur
   * Kategorileri ilişkilendirir
   */
  async create(createStoryDto: CreateStoryDto, authorId: string): Promise<Story> {
    const { categoryIds, ...storyData } = createStoryDto;

    const story = this.storiesRepository.create({
      ...storyData,
      authorId,
    });

    // Kategorileri ilişkilendir
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoriesRepository.findBy({
        id: In(categoryIds),
      });
      story.categories = categories;
    }

    return this.storiesRepository.save(story);
  }

  /**
   * Tüm hikayeleri getirir (yayınlanmış olanlar)
   * İlişkili verilerle birlikte (author, categories, comments)
   */
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

  /**
   * ID'ye göre hikaye getirir
   */
  async findOne(id: string): Promise<Story> {
    const story = await this.storiesRepository.findOne({
      where: { id },
      relations: ['author', 'author.profile', 'categories', 'comments', 'comments.author'],
    });

    if (!story) {
      throw new NotFoundException(`ID ${id} ile hikaye bulunamadı`);
    }

    return story;
  }

  /**
   * Kullanıcının hikayelerini getirir
   */
  async findByAuthor(authorId: string): Promise<Story[]> {
    return this.storiesRepository.find({
      where: { authorId },
      relations: ['categories', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Hikaye bilgilerini günceller
   * Sadece hikaye sahibi veya Admin/SuperAdmin güncelleyebilir
   */
  async update(id: string, updateStoryDto: UpdateStoryDto, userId: string, userRole: string): Promise<Story> {
    const story = await this.findOne(id);

    // Yetki kontrolü
    if (userRole === 'User' && story.authorId !== userId) {
      throw new ForbiddenException('Bu hikayeyi güncelleme yetkiniz yok');
    }

    // Kategorileri güncelle
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

  /**
   * Hikayeyi siler
   * Sadece hikaye sahibi veya Admin/SuperAdmin silebilir
   */
  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const story = await this.findOne(id);

    // Yetki kontrolü
    if (userRole === 'User' && story.authorId !== userId) {
      throw new ForbiddenException('Bu hikayeyi silme yetkiniz yok');
    }

    await this.storiesRepository.remove(story);
  }

  /**
   * Hikayeyi beğenir veya beğenmez
   * Her kullanıcı bir hikayeye sadece bir kez tepki verebilir
   * Aynı tepkiyi tekrar verirse geri alınır (toggle)
   * Farklı tepki verirse değiştirilir
   */
  async likeStory(id: string, likeStoryDto: LikeStoryDto, userId: string): Promise<{ story: Story; userAction: string | null }> {
    const story = await this.findOne(id);

    // Kullanıcının mevcut tepkisini kontrol et
    const existingLike = await this.storyLikesRepository.findOne({
      where: { storyId: id, userId },
    });

    if (existingLike) {
      // Aynı tepki verilmişse geri al (toggle)
      if (existingLike.action === likeStoryDto.action) {
        // Sayıyı azalt
        if (existingLike.action === 'like') {
          story.likes = Math.max(0, story.likes - 1);
        } else {
          story.dislikes = Math.max(0, story.dislikes - 1);
        }

        // Like kaydını sil
        await this.storyLikesRepository.remove(existingLike);
        await this.storiesRepository.save(story);

        return { story, userAction: null };
      } else {
        // Farklı tepki verilmişse değiştir
        // Eski tepkiyi azalt
        if (existingLike.action === 'like') {
          story.likes = Math.max(0, story.likes - 1);
        } else {
          story.dislikes = Math.max(0, story.dislikes - 1);
        }

        // Yeni tepkiyi artır
        if (likeStoryDto.action === 'like') {
          story.likes += 1;
        } else {
          story.dislikes += 1;
        }

        // Like kaydını güncelle
        existingLike.action = likeStoryDto.action;
        await this.storyLikesRepository.save(existingLike);
        await this.storiesRepository.save(story);

        return { story, userAction: likeStoryDto.action };
      }
    } else {
      // İlk kez tepki veriliyor
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

  /**
   * Kullanıcının bir hikayeye verdiği tepkiyi getirir
   */
  async getUserLikeStatus(storyId: string, userId: string): Promise<string | null> {
    const like = await this.storyLikesRepository.findOne({
      where: { storyId, userId },
    });
    return like ? like.action : null;
  }
}

