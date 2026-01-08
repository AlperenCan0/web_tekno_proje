import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LikeStoryDto {
  @ApiProperty({ example: 'like', enum: ['like', 'dislike'], description: 'Beğeni türü' })
  @IsEnum(['like', 'dislike'])
  action: 'like' | 'dislike';
}
