import { Module } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { ProfessionalsController } from './professionals.controller';
import { AvailabilitiesService } from 'src/availabilities/availabilities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from 'src/database/entity/availability.entity';
import { Schedule } from 'src/database/entity/schedule.entity';
import { SchedulesService } from 'src/schedules/schedules.service';

@Module({
  imports: [TypeOrmModule.forFeature([Availability, Schedule])],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService, AvailabilitiesService, SchedulesService],
})
export class ProfessionalsModule {}
