import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('Upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Sadece resim dosyaları yüklenebilir (jpg, jpeg, png, gif)'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiOperation({ summary: 'Fotoğraf yükler' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Fotoğraf başarıyla yüklendi' })
  @ApiResponse({ status: 400, description: 'Geçersiz dosya formatı veya boyutu' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenemedi');
    }

    const savedFile = await this.uploadService.saveFile(file);

    return {
      filename: savedFile.filename,
      originalName: savedFile.originalName,
      mimetype: savedFile.mimetype,
      size: savedFile.size,
      url: `/upload/view/${savedFile.filename}`,
    };
  }

  @Get('view/:filename')
  @ApiOperation({ summary: 'Fotoğrafı görüntüler' })
  async viewPhoto(@Param('filename') filename: string, @Res() res: Response) {
    const file = await this.uploadService.getFile(filename);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `inline; filename="${file.filename}"`,
    });

    res.send(file.data);
  }
}
