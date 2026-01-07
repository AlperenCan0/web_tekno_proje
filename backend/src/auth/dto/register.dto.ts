import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Kullanıcı kayıt DTO'su
 * Register endpoint'inde kullanılır
 */
export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Kullanıcı e-posta adresi' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'johndoe', description: 'Kullanıcı adı' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'password123', description: 'Kullanıcı şifresi (min 6 karakter)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'Ad', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Soyad', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}

