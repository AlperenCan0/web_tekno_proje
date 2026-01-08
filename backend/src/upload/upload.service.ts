import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
    ) { }

    async saveFile(file: Express.Multer.File): Promise<FileEntity> {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // get extension
        const originalName = file.originalname;
        const ext = originalName.substring(originalName.lastIndexOf('.'));
        const filename = `photo-${uniqueSuffix}${ext}`;

        const newFile = this.fileRepository.create({
            filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            data: file.buffer,
            size: file.size,
        });

        return await this.fileRepository.save(newFile);
    }

    async getFile(filename: string): Promise<FileEntity> {
        const file = await this.fileRepository.findOne({ where: { filename } });
        if (!file) {
            throw new NotFoundException('Fotoğraf bulunamadı');
        }
        return file;
    }
}
