import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

/**
 * Kategori güncelleme DTO'su
 * UPDATE endpoint'inde kullanılır
 * Tüm alanlar opsiyoneldir
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

