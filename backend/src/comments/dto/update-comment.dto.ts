import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Yorum güncelleme DTO'su
 * UPDATE endpoint'inde kullanılır
 */
export class UpdateCommentDto {
  @ApiProperty({ example: 'Güncellenmiş yorum içeriği', description: 'Yorum içeriği', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;
}

