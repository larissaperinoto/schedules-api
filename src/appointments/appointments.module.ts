import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { SchedulesService } from 'src/schedules/schedules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/database/entity/schedule.entity';
import { Availability } from 'src/database/entity/availability.entity';
import { AvailabilitiesService } from 'src/availabilities/availabilities.service';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Availability])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, SchedulesService, AvailabilitiesService],
})
export class AppointmentsModule {}
