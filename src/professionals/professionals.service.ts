import { Injectable } from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { AvailabilitiesService } from 'src/availabilities/availabilities.service';
import { FindAvailabilityDto } from './dto/find-availability.dto';

@Injectable()
export class ProfessionalsService {
  constructor(private availabilityService: AvailabilitiesService) {}

  public async createAvailability({
    professionalId,
    date,
    availabilities,
  }: CreateAvailabilityDto) {
    for (const { startHour, endHour } of availabilities) {
      await this.availabilityService.insert({
        professionalId,
        date,
        startHour,
        endHour,
      });
    }
  }

  public async findAvailabilityById({
    professionalId,
    date,
  }: FindAvailabilityDto) {}
}
