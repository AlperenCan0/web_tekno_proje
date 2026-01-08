import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@example.com', description: 'Admin e-posta adresi' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin', description: 'Admin kullanıcı adı' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'admin123', description: 'Admin şifresi (min 6 karakter)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Admin', description: 'Ad', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'User', description: 'Soyad', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}
