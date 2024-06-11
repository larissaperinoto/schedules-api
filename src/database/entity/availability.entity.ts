import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('availabilities')
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  professionalId: string;

  @Column()
  date: Date;

  @Column()
  startHour: string;

  @Column()
  endHour: string;
}
