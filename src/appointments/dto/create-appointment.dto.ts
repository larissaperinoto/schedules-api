import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinDate } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  professionalId: string;

  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  endDate: Date;
}
