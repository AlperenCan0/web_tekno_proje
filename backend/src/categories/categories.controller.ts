import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Categories Controller - Kategori yönetimi endpoint'lerini yönetir
 * CRUD operasyonları sağlar
 */
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * POST /categories - Yeni kategori oluşturur
   * Sadece Admin ve SuperAdmin erişebilir
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yeni kategori oluşturur (Admin/SuperAdmin)' })
  @ApiResponse({ status: 201, description: 'Kategori başarıyla oluşturuldu' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * GET /categories - Tüm kategorileri listeler
   * Herkes kategorileri görebilir
   */
  @Get()
  @ApiOperation({ summary: 'Tüm kategorileri listeler' })
  @ApiResponse({ status: 200, description: 'Kategori listesi' })
  findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * GET /categories/:id - ID'ye göre kategori getirir
   * Herkes kategori detaylarını görebilir
   */
  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre kategori getirir' })
  @ApiResponse({ status: 200, description: 'Kategori detayları' })
  @ApiResponse({ status: 404, description: 'Kategori bulunamadı' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * PATCH /categories/:id - Kategori bilgilerini günceller
   * Sadece Admin ve SuperAdmin erişebilir
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kategori bilgilerini günceller (Admin/SuperAdmin)' })
  @ApiResponse({ status: 200, description: 'Kategori başarıyla güncellendi' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * DELETE /categories/:id - Kategoriyi siler
   * Sadece Admin ve SuperAdmin erişebilir
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kategoriyi siler (Admin/SuperAdmin)' })
  @ApiResponse({ status: 200, description: 'Kategori başarıyla silindi' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}

