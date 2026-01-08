import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Bu e-posta adresi zaten kullanılıyor');
    }

    const existingUsername = await this.usersService.findByUsername(registerDto.username);
    if (existingUsername) {
      throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userId: user.id,
      username: user.username,
      role: user.role,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Hesabınız aktif değil');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userId: user.id,
      username: user.username,
      role: user.role,
    };
  }

  async validateUser(userId: string) {
    return await this.usersService.findOne(userId);
  }

  async createFirstAdmin(createAdminDto: CreateAdminDto): Promise<AuthResponseDto> {
    const existingAdmin = await this.usersRepository.findOne({
      where: [
        { role: 'Admin' },
        { role: 'SuperAdmin' },
      ],
    });

    if (existingAdmin) {
      throw new BadRequestException('Sistemde zaten bir admin kullanıcısı mevcut. Admin oluşturmak için mevcut admin hesabınızla giriş yapın.');
    }

    const existingUser = await this.usersService.findByEmail(createAdminDto.email);
    if (existingUser) {
      throw new ConflictException('Bu e-posta adresi zaten kullanılıyor');
    }

    const existingUsername = await this.usersService.findByUsername(createAdminDto.username);
    if (existingUsername) {
      throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.usersService.create({
      email: createAdminDto.email,
      username: createAdminDto.username,
      password: hashedPassword,
      role: 'Admin',
      firstName: createAdminDto.firstName,
      lastName: createAdminDto.lastName,
      isActive: true,
    });

    const payload = { email: admin.email, sub: admin.id, role: admin.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userId: admin.id,
      username: admin.username,
      role: admin.role,
    };
  }
}
