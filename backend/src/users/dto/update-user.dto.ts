import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * Kullanıcı güncelleme DTO'su
 * UPDATE endpoint'inde kullanılır
 * Tüm alanlar opsiyoneldir
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}

