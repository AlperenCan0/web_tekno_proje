import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Tarihi Yerler', description: 'Kategori adı' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Tarihi mekanlar ve yerler', description: 'Kategori açıklaması', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'icon.png', description: 'Kategori ikonu URL\'i', required: false })
  @IsOptional()
  @IsString()
  icon?: string;
}
