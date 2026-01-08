import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/base.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * Categories Service - Kategori işlemlerini yönetir
 * CRUD operasyonları gerçekleştirir
 */
@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {
    super();
  }

  /**
   * Yeni kategori oluşturur
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  /**
   * Tüm kategorileri getirir
   * İlişkili hikayelerle birlikte
   */
  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['stories'],
      order: { name: 'ASC' },
    });
  }

  /**
   * ID'ye göre kategori getirir
   */
  async findOne(id: string): Promise<Category> {
    return this.findOneOrFail(
      this.categoriesRepository,
      id,
      'kategori',
      ['stories', 'stories.author'],
    );
  }

  /**
   * Kategori bilgilerini günceller
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  /**
   * Kategoriyi siler
   */
  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
}

