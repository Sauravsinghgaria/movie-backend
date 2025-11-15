import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from 'src/entities/movies.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async addMovie(movieData: {
    title: string;
    publishingYear: string;
    poster?: string;
  }): Promise<Movie> {
    const movie = this.movieRepository.create(movieData);
    return this.movieRepository.save(movie);
  }

  async updateMovie(
    id: number,
    movieData: {
      title?: string;
      publishingYear?: string;
      poster?: string;
    },
  ): Promise<Movie | null> {
    await this.movieRepository.update(id, movieData);
    return this.movieRepository.findOne({ where: { id } });
  }
}
