import { PartialType } from '@nestjs/swagger';
import { CreateStoryDto } from './create-story.dto';

/**
 * Hikaye güncelleme DTO'su
 * UPDATE endpoint'inde kullanılır
 * Tüm alanlar opsiyoneldir
 */
export class UpdateStoryDto extends PartialType(CreateStoryDto) {}

