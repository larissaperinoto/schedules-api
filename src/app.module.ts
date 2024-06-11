import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilitiesModule } from './availabilities/availabilities.module';
import { Availability } from './availabilities/entities/availability.entity';
import { ProfessionalsModule } from './professionals/professionals.module';
import { SnakeNamingStrategy } from 'typeorm-snake-naming-strategy';
import { ConfigModule } from '@nestjs/config';

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
      entities: [Availability],
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    AvailabilitiesModule,
    ProfessionalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
