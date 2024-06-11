import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  scheduleId: string;

  @Column()
  professionalId: string;

  @Column()
  clientId: string;

  @Column()
  date: Date;

  @Column()
  startHour: string;

  @Column()
  endHour: string;
}
