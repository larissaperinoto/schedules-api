import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InsertScheduleDto } from './dto/insert-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../database/entity/schedule.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { FindByDateRangeDto } from './dto/findBy.dto';

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

  public async findBetweenDateRange({
    startDate,
    endDate,
  }: FindByDateRangeDto) {
    return await this.scheduleRepository.find({
      where: [
        { startDate: Between(startDate, endDate) },
        { endDate: Between(startDate, endDate) },
      ],
    });
  }

  public async findSchedules({ startDate, endDate, professionalId }) {
    const query = { where: {} };

    if (startDate) {
      query.where['startDate'] = MoreThanOrEqual(startDate);
    }

    if (endDate) {
      query.where['endDate'] = LessThanOrEqual(endDate);
    }

    if (professionalId) {
      query.where['professionalId'] = professionalId;
    }

    return await this.scheduleRepository.find(query);
  }

  public async removeSchedule({
    professionalId,
    startDate,
    endDate,
  }: Partial<InsertScheduleDto>) {
    await this.scheduleRepository
      .createQueryBuilder()
      .delete()
      .from(Schedule)
      .where('professionalId = :professionalId', { professionalId })
      .andWhere('startDate >= :startDate AND endDate <= :endDate', {
        startDate,
        endDate,
      })
      .execute();
  }
}
