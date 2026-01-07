import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';

/**
 * Upload Module - Dosya yükleme modülü
 * Fotoğraf yükleme işlemlerini yönetir
 */
@Module({
  controllers: [UploadController],
})
export class UploadModule {}

