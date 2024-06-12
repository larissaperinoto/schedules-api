import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InsertScheduleDto } from './dto/insert-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../database/entity/schedule.entity';
import { Between, Repository } from 'typeorm';
import { FindByRangeDto } from './dto/findBy.dto';

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
    try {
      return await this.scheduleRepository.insert({
        professionalId,
        clientId,
        startDate,
        endDate,
      });
    } catch (e) {
      throw new HttpException(
        'Unable to enter a schedule',
        e.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findByRange({ startDate, endDate }: FindByRangeDto) {
    return await this.scheduleRepository.find({
      where: [
        { startDate: Between(startDate, endDate) },
        { endDate: Between(startDate, endDate) },
      ],
    });
  }

  public async findByProfessionalId(professionalId: string) {
    return await this.scheduleRepository.find({
      where: { professionalId },
    });
  }
}
