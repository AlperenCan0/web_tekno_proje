import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Kullanıcı giriş DTO'su
 * Login endpoint'inde kullanılır
 */
export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Kullanıcı e-posta adresi' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Kullanıcı şifresi' })
  @IsString()
  password: string;
}

