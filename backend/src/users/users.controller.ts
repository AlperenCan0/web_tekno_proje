import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Users Controller - Kullanıcı yönetimi endpoint'lerini yönetir
 * CRUD operasyonları sağlar
 */
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * POST /users - Yeni kullanıcı oluşturur
   * Sadece Admin ve SuperAdmin erişebilir
   * Admin/SuperAdmin rolü atamak için SuperAdmin olmak gerekir
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiOperation({ summary: 'Yeni kullanıcı oluşturur (Admin/SuperAdmin)' })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu' })
  @ApiResponse({ status: 403, description: 'Admin/SuperAdmin oluşturmak için SuperAdmin yetkisi gerekli' })
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() currentUser: any) {
    // Admin veya SuperAdmin oluşturmak için SuperAdmin olmak gerekir
    if (createUserDto.role && ['Admin', 'SuperAdmin'].includes(createUserDto.role)) {
      if (currentUser.role !== 'SuperAdmin') {
        throw new ForbiddenException('Admin veya SuperAdmin oluşturmak için SuperAdmin yetkisi gereklidir');
      }
    }
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users - Tüm kullanıcıları listeler
   * Sadece Admin ve SuperAdmin erişebilir
   * Mevcut kullanıcı listede gösterilmez
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiOperation({ summary: 'Tüm kullanıcıları listeler (Admin/SuperAdmin)' })
  @ApiResponse({ status: 200, description: 'Kullanıcı listesi' })
  async findAll(@CurrentUser() currentUser: any) {
    const users = await this.usersService.findAll();
    // Mevcut kullanıcıyı listeden çıkar
    return users.filter(user => user.id !== currentUser.id);
  }

  /**
   * GET /users/me - Mevcut kullanıcının bilgilerini getirir
   * Tüm kullanıcılar kendi bilgilerine erişebilir
   */
  @Get('me')
  @ApiOperation({ summary: 'Mevcut kullanıcının bilgilerini getirir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri' })
  getMe(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  /**
   * GET /users/:id - ID'ye göre kullanıcı getirir
   * Kullanıcılar sadece kendi bilgilerine, Admin/SuperAdmin tüm kullanıcılara erişebilir
   */
  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre kullanıcı getirir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    // Kullanıcı sadece kendi bilgilerine erişebilir (Admin/SuperAdmin hariç)
    if (currentUser.role === 'User' && currentUser.id !== id) {
      throw new ForbiddenException('Bu kullanıcıya erişim yetkiniz yok');
    }
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id - Kullanıcı bilgilerini günceller
   * Kullanıcılar sadece kendi bilgilerini, Admin/SuperAdmin tüm kullanıcıları güncelleyebilir
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Kullanıcı bilgilerini günceller' })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla güncellendi' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ) {
    // Kullanıcı sadece kendi bilgilerini güncelleyebilir (Admin/SuperAdmin hariç)
    if (currentUser.role === 'User' && currentUser.id !== id) {
      throw new ForbiddenException('Bu kullanıcıyı güncelleme yetkiniz yok');
    }
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id - Kullanıcıyı siler
   * Sadece Admin ve SuperAdmin erişebilir
   * Kullanıcılar kendilerini silemez
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiOperation({ summary: 'Kullanıcıyı siler (Admin/SuperAdmin)' })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla silindi' })
  @ApiResponse({ status: 403, description: 'Kendinizi silemezsiniz' })
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    // Kullanıcılar kendilerini silemez
    if (currentUser.id === id) {
      throw new ForbiddenException('Kendinizi silemezsiniz');
    }
    return this.usersService.remove(id);
  }
}

