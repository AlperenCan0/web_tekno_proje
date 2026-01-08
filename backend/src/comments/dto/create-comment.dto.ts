import { IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Harika bir hikaye!', description: 'Yorum içeriği' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({ example: 'story-uuid', description: 'Hikaye ID' })
  @IsUUID()
  storyId: string;
}
