import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

/**
 * Auth Service - Kimlik doğrulama ve yetkilendirme işlemlerini yönetir
 * Login, Register ve JWT token oluşturma işlemlerini gerçekleştirir
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Kullanıcı kayıt işlemi
   * Şifreyi hash'ler ve yeni kullanıcı oluşturur
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // E-posta kontrolü
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Bu e-posta adresi zaten kullanılıyor');
    }

    // Kullanıcı adı kontrolü
    const existingUsername = await this.usersService.findByUsername(registerDto.username);
    if (existingUsername) {
      throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Kullanıcıyı oluştur
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // JWT token oluştur
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userId: user.id,
      username: user.username,
      role: user.role,
    };
  }

  /**
   * Kullanıcı giriş işlemi
   * E-posta ve şifreyi doğrular, JWT token döner
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Hesabınız aktif değil');
    }

    // JWT token oluştur
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userId: user.id,
      username: user.username,
      role: user.role,
    };
  }

  /**
   * JWT token'dan kullanıcı doğrulama
   */
  async validateUser(userId: string) {
    return await this.usersService.findOne(userId);
  }
}

