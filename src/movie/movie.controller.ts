import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieService } from './movie.service';
import { S3Service } from 'src/s3/s3.service';
import { Movie, PosterData } from 'src/entities/movies.entity';

@Controller('movie')
export class MovieController {
  constructor(
    private movieService: MovieService,
    private s3Service: S3Service,
  ) {}

  @Get('')
  async getAllMovies(): Promise<Movie[]> {
    return this.movieService.getAllMovies();
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('poster'))
  async addMovie(
    @UploadedFile() file: any,
    @Body()
    movieData: {
      title: string;
      publishingYear: string;
    },
  ): Promise<Movie> {
    let posterData: PosterData | null = null;

    // Upload file to S3 if provided
    if (file) {
      const s3Response = await this.s3Service.uploadFile(file);
      posterData = {
        s3Url: s3Response.url,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        fileName: file.originalname,
      };
    }

    const payload: {
      title: string;
      publishingYear: string;
      poster?: PosterData;
    } = { ...movieData } as { title: string; publishingYear: string };

    if (posterData) {
      payload.poster = posterData;
    }

    return this.movieService.addMovie(payload);
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('poster'))
  async updateMovie(
    @Param('id') id: number,
    @UploadedFile() file: any,
    @Body()
    movieData: {
      title?: string;
      publishingYear?: string;
    },
  ): Promise<Movie | null> {
    let posterData: PosterData | null = null;

    // Upload file to S3 if provided
    if (file) {
      const s3Response = await this.s3Service.uploadFile(file);
      posterData = {
        s3Url: s3Response.url,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        fileName: file.originalname,
      };
    }

    const updatePayload: {
      title?: string;
      publishingYear?: string;
      poster?: PosterData;
    } = { ...movieData };

    if (posterData) {
      updatePayload.poster = posterData;
    }

    return this.movieService.updateMovie(id, updatePayload);
  }
}
