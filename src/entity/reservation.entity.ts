import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Reservation {

  @PrimaryGeneratedColumn()
  reservation_id: number;

  @Column()
  date: Date;

  @ManyToOne(() => User, user => user.user_id)
  user_id: number;

  @Column()
  movie_id: number;
}