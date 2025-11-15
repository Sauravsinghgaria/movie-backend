import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Movie } from 'src/entities/movies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Movie])],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
