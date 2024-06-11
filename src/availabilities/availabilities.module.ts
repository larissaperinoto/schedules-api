import { Module } from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from '../database/entity/availability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Availability])],
  providers: [AvailabilitiesService],
})
export class AvailabilitiesModule {}
