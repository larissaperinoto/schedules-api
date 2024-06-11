import { Injectable } from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { AvailabilitiesService } from 'src/availabilities/availabilities.service';
import { FindAvailabilityDto } from './dto/find-availability.dto';

@Injectable()
export class ProfessionalsService {
  constructor(private availabilityService: AvailabilitiesService) {}

  public async createAvailability({
    professionalId,
    availabilities,
  }: CreateAvailabilityDto) {
    for (const { startDate, endDate } of availabilities) {
      await this.availabilityService.insert({
        professionalId,
        startDate,
        endDate,
      });
    }
  }

  public async findAvailabilityById({
    professionalId,
    date,
  }: FindAvailabilityDto) {}
}
