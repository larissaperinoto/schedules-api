import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  professionalId: string;

  @Column()
  clientId: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
