import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InsertAvailabilityDto } from './dto/insert-availability.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Availability } from '../database/entity/availability.entity';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { FindByProfessionalIdDto } from './dto/findBy.dto';

@Injectable()
export class AvailabilitiesService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) {}

  public async insert({
    professionalId,
    startDate,
    endDate,
  }: InsertAvailabilityDto) {
    try {
      return await this.availabilityRepository.insert({
        professionalId,
        startDate,
        endDate,
      });
    } catch (e) {
      throw new HttpException(
        'Unable to enter availability data',
        e.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findByProfessionalId({
    professionalId,
    startDate,
    endDate,
  }: FindByProfessionalIdDto) {
    if (startDate && endDate) {
      return await this.availabilityRepository.find({
        where: [
          { professionalId },
          { startDate: MoreThan(startDate) },
          { endDate: LessThan(endDate) },
        ],
        order: {
          startDate: 'ASC',
        },
      });
    } else {
      return await this.availabilityRepository.find({
        where: { professionalId },
      });
    }
  }
}
