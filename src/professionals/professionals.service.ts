import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { AvailabilitiesService } from 'src/availabilities/availabilities.service';
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

  public async findAvailabilities({ professionalId, startDate, endDate }) {
    const start: Date = startDate ?? new Date();

    const availabilities = await this.availabilityService.findAvailabilities({
      professionalId,
      startDate: start,
      endDate,
    });

    const schedules = await this.schedulesService.findSchedules({
      professionalId,
      startDate: start,
      endDate,
    });

    const result = [];

    const professionals = this.groupByProfessional(availabilities, schedules);

    for (const professional of Object.entries(professionals)) {
      result.push({
        professionalId: professional[0],
        slots: this.calculateAvailableSlots(
          professional[1]['availabilities'],
          professional[1]['schedules'],
        ),
      });
    }

    return result;
  }

  private groupByProfessional(
    availabilities: Availability[],
    schedules: Schedule[],
  ) {
    return availabilities.reduce((acc, curr) => {
      const professionalId = curr.professionalId;
      if (!acc[professionalId]) {
        acc[professionalId] = {
          availabilities: [
            { startDate: curr.startDate, endDate: curr.endDate },
          ],
          schedules: schedules.filter(
            ({ professionalId }) => professionalId === curr.professionalId,
          ),
        };
      } else {
        acc[professionalId].availabilities.push({
          startDate: curr.startDate,
          endDate: curr.endDate,
        });
      }

      return acc;
    }, {});
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
        current.setMinutes(current.getMinutes() + 30)
      ) {
        const nextHour = new Date(current);
        nextHour.setMinutes(nextHour.getMinutes() + 30);

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

  public async removeAvailability({
    professionalId,
    date,
  }: Partial<CreateAvailabilityDto> & { date: string }) {
    const [year, month, day] = date.split('-').map(Number);

    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    await this.availabilityService.removeAvailability({
      professionalId,
      startDate,
      endDate,
    });

    await this.schedulesService.removeSchedule({
      professionalId,
      startDate,
      endDate,
    });
  }

  public async updateAvailability({
    professionalId,
    availabilities,
  }: CreateAvailabilityDto) {
    for (const { startDate } of availabilities) {
      const date = new Date(startDate).toISOString().split('T')[0];

      await this.removeAvailability({
        professionalId,
        date,
      });
    }

    await this.createAvailability({ professionalId, availabilities });

    return {
      message: 'Availability updated successfully',
    };
  }
}
