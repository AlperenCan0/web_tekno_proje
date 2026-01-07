import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Hikaye oluşturma DTO'su
 * CREATE endpoint'inde kullanılır
 */
export class CreateStoryDto {
  @ApiProperty({ example: 'İstanbul Boğazı Hikayesi', description: 'Hikaye başlığı' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'Bu hikaye İstanbul Boğazı...', description: 'Hikaye içeriği' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({ example: 41.0082, description: 'Enlem (latitude)', required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 28.9784, description: 'Boylam (longitude)', required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 'İstanbul, Kadıköy', description: 'Lokasyon adı', required: false })
  @IsOptional()
  @IsString()
  locationName?: string;

  @ApiProperty({ example: ['photo1.jpg', 'photo2.jpg'], description: 'Fotoğraf URL\'leri', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @ApiProperty({ example: ['category-id-1', 'category-id-2'], description: 'Kategori ID\'leri', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiProperty({ example: true, description: 'Yayınlanmış mı?', required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

