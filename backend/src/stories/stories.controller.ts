import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { LikeStoryDto } from './dto/like-story.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Stories Controller - Hikaye yönetimi endpoint'lerini yönetir
 * CRUD operasyonları, like/dislike ve kategori yönetimi sağlar
 */
@ApiTags('Stories')
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) { }

  /**
   * POST /stories - Yeni hikaye oluşturur
   * Giriş yapmış kullanıcılar hikaye oluşturabilir
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yeni hikaye oluşturur' })
  @ApiResponse({ status: 201, description: 'Hikaye başarıyla oluşturuldu' })
  create(@Body() createStoryDto: CreateStoryDto, @CurrentUser() user: any) {
    return this.storiesService.create(createStoryDto, user.id);
  }

  /**
   * GET /stories - Tüm hikayeleri listeler
   * Varsayılan olarak sadece yayınlanmış hikayeleri gösterir
   * Admin/SuperAdmin tüm hikayeleri görebilir
   */
  @Get()
  @ApiOperation({ summary: 'Tüm hikayeleri listeler' })
  @ApiQuery({ name: 'publishedOnly', required: false, type: Boolean, description: 'Sadece yayınlanmış hikayeler' })
  @ApiResponse({ status: 200, description: 'Hikaye listesi' })
  findAll(@Query('publishedOnly') publishedOnly?: string) {
    const published = publishedOnly !== 'false';
    return this.storiesService.findAll(published);
  }

  /**
   * GET /stories/my - Mevcut kullanıcının hikayelerini listeler
   * Giriş yapmış kullanıcılar kendi hikayelerini görebilir
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mevcut kullanıcının hikayelerini listeler' })
  @ApiResponse({ status: 200, description: 'Kullanıcının hikaye listesi' })
  findMyStories(@CurrentUser() user: any) {
    return this.storiesService.findByAuthor(user.id);
  }

  /**
   * GET /stories/:id - ID'ye göre hikaye getirir
   * Herkes hikaye detaylarını görebilir
   */
  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre hikaye getirir' })
  @ApiResponse({ status: 200, description: 'Hikaye detayları' })
  @ApiResponse({ status: 404, description: 'Hikaye bulunamadı' })
  findOne(@Param('id') id: string) {
    return this.storiesService.findOne(id);
  }

  /**
   * PATCH /stories/:id - Hikaye bilgilerini günceller
   * Sadece hikaye sahibi veya Admin/SuperAdmin güncelleyebilir
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Hikaye bilgilerini günceller' })
  @ApiResponse({ status: 200, description: 'Hikaye başarıyla güncellendi' })
  @ApiResponse({ status: 403, description: 'Bu hikayeyi güncelleme yetkiniz yok' })
  update(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
    @CurrentUser() user: any,
  ) {
    return this.storiesService.update(id, updateStoryDto, user.id, user.role);
  }

  /**
   * DELETE /stories/:id - Hikayeyi siler
   * Sadece hikaye sahibi veya Admin/SuperAdmin silebilir
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Hikayeyi siler' })
  @ApiResponse({ status: 200, description: 'Hikaye başarıyla silindi' })
  @ApiResponse({ status: 403, description: 'Bu hikayeyi silme yetkiniz yok' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.storiesService.remove(id, user.id, user.role);
  }

  /**
   * POST /stories/:id/like - Hikayeyi beğenir veya beğenmez
   * Giriş yapmış kullanıcılar beğenebilir/beğenmeyebilir (her kullanıcı bir kez)
   */
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Hikayeyi beğenir veya beğenmez' })
  @ApiResponse({ status: 200, description: 'Beğeni işlemi başarılı' })
  @ApiResponse({ status: 400, description: 'Bu hikayeyi zaten beğendiniz/beğenmediniz' })
  likeStory(
    @Param('id') id: string,
    @Body() likeStoryDto: LikeStoryDto,
    @CurrentUser() user: any,
  ) {
    return this.storiesService.likeStory(id, likeStoryDto, user.id);
  }

  /**
   * GET /stories/:id/like-status - Kullanıcının bu hikayeye verdiği tepkiyi getirir
   * Giriş yapmış kullanıcıların mevcut tepkisini kontrol eder
   */
  @Get(':id/like-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kullanıcının bu hikayeye verdiği tepkiyi getirir' })
  @ApiResponse({ status: 200, description: 'Kullanıcının mevcut tepkisi (like/dislike/null)' })
  async getLikeStatus(@Param('id') id: string, @CurrentUser() user: any) {
    const action = await this.storiesService.getUserLikeStatus(id, user.id);
    return { userAction: action };
  }
}

