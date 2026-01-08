import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı oluşturur' })
  @ApiResponse({ status: 201, description: 'Kayıt başarılı', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'E-posta veya kullanıcı adı zaten kullanılıyor' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kullanıcı girişi yapar' })
  @ApiResponse({ status: 200, description: 'Giriş başarılı', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Geçersiz e-posta veya şifre' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('create-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'İlk admin kullanıcısını oluşturur (Sadece hiç admin yoksa)' })
  @ApiResponse({ status: 201, description: 'Admin başarıyla oluşturuldu', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Sistemde zaten bir admin mevcut' })
  @ApiResponse({ status: 409, description: 'E-posta veya kullanıcı adı zaten kullanılıyor' })
  async createFirstAdmin(@Body() createAdminDto: CreateAdminDto): Promise<AuthResponseDto> {
    return this.authService.createFirstAdmin(createAdminDto);
  }
}
