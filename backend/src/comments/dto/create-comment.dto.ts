import { IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Yorum oluşturma DTO'su
 * CREATE endpoint'inde kullanılır
 */
export class CreateCommentDto {
  @ApiProperty({ example: 'Harika bir hikaye!', description: 'Yorum içeriği' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({ example: 'story-uuid', description: 'Hikaye ID' })
  @IsUUID()
  storyId: string;
}

