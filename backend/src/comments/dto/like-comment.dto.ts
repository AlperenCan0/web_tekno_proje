import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Yorum beğeni/beğenmeme DTO'su
 * Like/Dislike endpoint'inde kullanılır
 */
export class LikeCommentDto {
  @ApiProperty({ example: 'like', enum: ['like', 'dislike'], description: 'Beğeni türü' })
  @IsEnum(['like', 'dislike'])
  action: 'like' | 'dislike';
}

