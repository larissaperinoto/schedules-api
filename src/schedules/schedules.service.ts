import { Injectable } from '@nestjs/common';
import { InsertScheduleDto } from './dto/insert-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../database/entity/schedule.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  public async insert({
    professionalId,
    clientId,
    startDate,
    endDate,
  }: InsertScheduleDto) {
    return await this.scheduleRepository.insert({
      professionalId,
      clientId,
      startDate,
      endDate,
    });
  }

  public async findByRange({ startDate, endDate }) {
    return await this.scheduleRepository.find({
      where: [
        { startDate: Between(startDate, endDate) },
        { endDate: Between(startDate, endDate) },
      ],
    });
  }
}
