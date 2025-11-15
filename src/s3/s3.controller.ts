import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import type { Request } from 'express';
import type { File as MulterFile } from 'multer';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MulterFile) {
    if (!file) {
      return { message: 'No file provided' };
    }
    // Pass file to S3Service if needed, or just call uploadFile()
    const result = await this.s3Service.uploadFile();
    return { message: 'File uploaded successfully', url: result.url };
  }
}
