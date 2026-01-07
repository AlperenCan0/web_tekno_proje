import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Seed Controller - Veritabanı seed işlemleri için endpoint
 * Sadece SuperAdmin erişebilir
 */
@ApiTags('Seed')
@Controller('seed')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SuperAdmin')
@ApiBearerAuth('JWT-auth')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  /**
   * POST /seed - Veritabanına örnek veriler yükler
   * Sadece SuperAdmin erişebilir
   * Kullanıcılar, kategoriler, hikayeler ve yorumlar oluşturur
   */
  @Post()
  @ApiOperation({ summary: 'Veritabanına örnek veriler yükler (SuperAdmin)' })
  @ApiResponse({ status: 201, description: 'Seed işlemi başarıyla tamamlandı' })
  async seed() {
    await this.seedService.seed();
    return { message: 'Seed işlemi başarıyla tamamlandı!' };
  }
}

