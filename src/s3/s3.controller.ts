import { Controller, Post } from '@nestjs/common';

@Controller('s3')
export class S3Controller {
  @Post('upload')
  async uploadFile() {
    return { message: 'File upload endpoint' };
  }
}
