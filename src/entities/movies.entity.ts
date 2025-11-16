import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export interface PosterData {
  s3Url: string;
  fileName: string;
}

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  publishingYear: string;

  @Column({ type: 'json', nullable: true })
  poster: PosterData | null;
}
