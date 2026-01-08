import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

/**
 * Seed Controller - Veritabanı seed işlemleri için endpoint
 * Sadece SuperAdmin erişebilir
 */
@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) { }

  /**
   * POST /seed - Veritabanına örnek veriler yükler
   * Sadece SuperAdmin erişebilir
   * Kullanıcılar, kategoriler, hikayeler ve yorumlar oluşturur
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SuperAdmin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Veritabanına örnek veriler yükler (SuperAdmin)' })
  @ApiResponse({ status: 201, description: 'Seed işlemi başarıyla tamamlandı' })
  async seed() {
    await this.seedService.seed();
    return { message: 'Seed işlemi başarıyla tamamlandı!' };
  }

  /**
   * GET /seed/categories - Sadece kategorileri oluşturur
   * DEV ortamı için - auth gerektirmez
   */
  @Get('categories')
  @ApiOperation({ summary: 'Sadece kategorileri oluşturur (DEV ONLY)' })
  @ApiResponse({ status: 200, description: 'Kategoriler oluşturuldu' })
  async initCategories() {
    const categoriesData = [
      { name: 'Tarih', description: 'Tarihi hikayeler ve olaylar' },
      { name: 'Doğa', description: 'Doğa ve çevre hikayeleri' },
      { name: 'Kültür', description: 'Kültürel deneyimler ve gözlemler' },
      { name: 'Macera', description: 'Macera ve keşif hikayeleri' },
      { name: 'Gezi', description: 'Seyahat ve gezi yazıları' },
      { name: 'Yemek', description: 'Yemek ve mutfak hikayeleri' },
    ];

    const createdCategories = [];
    for (const catData of categoriesData) {
      // Kategori zaten var mı kontrol et
      const existing = await this.categoriesRepository.findOne({ where: { name: catData.name } });
      if (!existing) {
        const category = this.categoriesRepository.create(catData);
        const saved = await this.categoriesRepository.save(category);
        createdCategories.push(saved);
      } else {
        createdCategories.push(existing);
      }
    }

    return {
      message: 'Kategoriler başarıyla oluşturuldu!',
      categories: createdCategories,
    };
  }
}
