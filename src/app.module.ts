import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilitiesModule } from './availabilities/availabilities.module';
import { Availability } from './database/entity/availability.entity';
import { ProfessionalsModule } from './professionals/professionals.module';
import { ConfigModule } from '@nestjs/config';
import { SchedulesModule } from './schedules/schedules.module';
import { Schedule } from './database/entity/schedule.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Availability, Schedule],
      synchronize: false,
      //migrations: ['src/database/migration/**/*.ts'],
      namingStrategy: new SnakeNamingStrategy(),
    }),
    AvailabilitiesModule,
    ProfessionalsModule,
    SchedulesModule,
    AppointmentsModule,
  ],
})
export class AppModule {}
