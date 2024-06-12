import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { AvailabilitiesService } from 'src/availabilities/availabilities.service';
import { FindAvailabilityProfessionalDto } from './dto/find-availability.dto';
import { SchedulesService } from 'src/schedules/schedules.service';
import { Availability } from 'src/database/entity/availability.entity';
import { Schedule } from 'src/database/entity/schedule.entity';

@Injectable()
export class ProfessionalsService {
  constructor(
    private availabilityService: AvailabilitiesService,
    private schedulesService: SchedulesService,
  ) {}

  public async createAvailability({
    professionalId,
    availabilities,
  }: CreateAvailabilityDto) {
    for (const { startDate, endDate } of availabilities) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      if (start > end) {
        throw new HttpException(
          'The end date cannot be greater than the start date',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.availabilityService.insert({
        professionalId,
        startDate,
        endDate,
      });
    }

    return {
      message: 'Availability entered successfully',
    };
  }

  public async findAvailabilityByProfessional({
    professionalId,
  }: FindAvailabilityProfessionalDto) {
    const availabilities = await this.availabilityService.findByProfessionalId({
      professionalId,
    });

    const schedules =
      await this.schedulesService.findByProfessionalId(professionalId);

    const availableSlots = this.calculateAvailableSlots(
      availabilities,
      schedules,
    );

    return {
      professionalId,
      availability: availableSlots,
    };
  }

  private calculateAvailableSlots(
    availabilities: Availability[],
    schedules: Schedule[],
  ) {
    const slots = [];

    availabilities.forEach((availiability) => {
      const start = new Date(availiability.startDate);
      const end = new Date(availiability.endDate);

      for (
        let current = start;
        current < end;
        current.setHours(current.getHours() + 1)
      ) {
        const nextHour = new Date(current);
        nextHour.setHours(nextHour.getHours() + 1);

        const isBooked = schedules.some(
          (schedule) =>
            (current >= schedule.startDate && current < schedule.endDate) ||
            (nextHour > schedule.startDate && nextHour <= schedule.endDate),
        );

        if (!isBooked && nextHour <= end) {
          slots.push({
            day: current.toISOString().split('T')[0],
            startTime: current.toISOString().split('T')[1].substring(0, 5),
            endTime: nextHour.toISOString().split('T')[1].substring(0, 5),
          });
        }
      }
    });

    return slots.reduce((acc, slot) => {
      const day = slot.day;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push({
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      return acc;
    }, {});
  }
}
