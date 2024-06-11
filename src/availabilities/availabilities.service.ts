import { Injectable } from '@nestjs/common';
import { InsertAvailabilityDto } from './dto/insert-availability.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Availability } from '../database/entity/availability.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AvailabilitiesService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) {}

  public async insert({
    professionalId,
    date,
    startHour,
    endHour,
  }: InsertAvailabilityDto) {
    return await this.availabilityRepository.insert({
      professionalId,
      date,
      startHour,
      endHour,
    });
  }

  public async findByProfessionalId(professionalId: string) {
    return await this.availabilityRepository.find({
      where: { professionalId },
    });
  }
}
