import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { SchedulesService } from 'src/schedules/schedules.service';
import { AvailabilitiesService } from 'src/availabilities/availabilities.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private scheduleService: SchedulesService,
    private availabilityService: AvailabilitiesService,
  ) {}

  public async createAppointment({
    professionalId,
    clientId,
    startDate,
    endDate,
  }: CreateAppointmentDto) {
    const availabilities = await this.availabilityService.findByProfessionalId({
      professionalId,
      startDate,
      endDate,
    });

    if (!availabilities.length) {
      throw new HttpException(
        'Time range is not available',
        HttpStatus.CONFLICT,
      );
    }

    const scheduleStartTimestamp = new Date(startDate).getTime();
    const scheduleEndTimestamp = new Date(endDate).getTime();

    if (
      availabilities.every((availability) => {
        return (
          scheduleStartTimestamp < new Date(availability.startDate).getTime()
        );
      })
    ) {
      throw new HttpException(
        'Time range is not available',
        HttpStatus.CONFLICT,
      );
    }

    if (
      availabilities.every((availability) => {
        return (
          scheduleStartTimestamp > new Date(availability.endDate).getTime()
        );
      })
    ) {
      throw new HttpException(
        'Time range is not available',
        HttpStatus.CONFLICT,
      );
    }

    if (
      availabilities.every((availability) => {
        return scheduleEndTimestamp > new Date(availability.endDate).getTime();
      })
    ) {
      throw new HttpException(
        'Time range is not available',
        HttpStatus.CONFLICT,
      );
    }

    const scheduled = await this.scheduleService.findBetweenDateRange({
      startDate,
      endDate,
    });

    if (scheduled.length > 0) {
      throw new HttpException(
        'Time range is not available',
        HttpStatus.CONFLICT,
      );
    }

    const endDateAdjusted = new Date(endDate);
    endDateAdjusted.setMinutes(endDateAdjusted.getMinutes() - 1);

    await this.scheduleService.insert({
      professionalId,
      clientId,
      startDate,
      endDate: endDateAdjusted,
    });

    return {
      message: 'Appointment entered successfully',
    };
  }
}
