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

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yeni kategori oluşturur (Admin/SuperAdmin)' })
  @ApiResponse({ status: 201, description: 'Kategori başarıyla oluşturuldu' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm kategorileri listeler' })
  @ApiResponse({ status: 200, description: 'Kategori listesi' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre kategori getirir' })
  @ApiResponse({ status: 200, description: 'Kategori detayları' })
  @ApiResponse({ status: 404, description: 'Kategori bulunamadı' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kategori bilgilerini günceller (Admin/SuperAdmin)' })
  @ApiResponse({ status: 200, description: 'Kategori başarıyla güncellendi' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

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
