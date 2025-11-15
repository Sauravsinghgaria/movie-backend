import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  rememberMe: boolean;

  @Column({ default: true })
  isActive: boolean;

  //   @OneToMany((type) => Photo, (photo) => photo.user)
  //   photos: Photo[];
}
