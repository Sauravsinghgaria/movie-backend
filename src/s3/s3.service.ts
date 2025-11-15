/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { File } from 'multer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class S3Service {
  private readonly AWS_REGION: string;
  private readonly AWS_ACCESS_KEY_ID: string;
  private readonly AWS_SECRET_ACCESS_KEY: string;
  private readonly S3_BUCKET: string;
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.AWS_REGION = this.configService.get<string>('AWS_REGION')!;
    this.AWS_ACCESS_KEY_ID =
      this.configService.get<string>('AWS_ACCESS_KEY_ID')!;
    this.AWS_SECRET_ACCESS_KEY = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    )!;
    this.S3_BUCKET = this.configService.get<string>('S3_BUCKET')!;

    this.s3 = new S3Client({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: File) {
    if (!file) throw new Error('No file provided');

    const fileKey = `${Date.now()}-${file.originalname}`;

    const params = {
      Bucket: this.S3_BUCKET,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.send(new PutObjectCommand(params));

    // Create public URL
    const url = `https://${this.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return { url };
  }
}
