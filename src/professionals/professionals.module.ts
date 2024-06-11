import { Module } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { ProfessionalsController } from './professionals.controller';
import { AvailabilitiesService } from 'src/availabilities/availabilities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from 'src/database/entity/availability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Availability])],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService, AvailabilitiesService],
})
export class ProfessionalsModule {}
