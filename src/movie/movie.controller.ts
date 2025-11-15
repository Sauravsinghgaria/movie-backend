import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from 'src/entities/movies.entity';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Post('add')
  async addMovie(
    @Body()
    movieData: {
      title: string;
      publishingYear: string;
      poster?: string;
    },
  ): Promise<Movie> {
    return this.movieService.addMovie(movieData);
  }

  @Put('update/:id')
  async updateMovie(
    @Param('id') id: number,
    @Body()
    movieData: {
      title?: string;
      publishingYear?: string;
      poster?: string;
    },
  ): Promise<Movie | null> {
    return this.movieService.updateMovie(id, movieData);
  }
}
