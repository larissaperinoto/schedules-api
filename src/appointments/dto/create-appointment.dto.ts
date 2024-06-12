import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinDate } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1D67H',
    description: 'Unique professional identifier',
  })
  professionalId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: '123RTF',
    description: 'Unique client identifier',
  })
  clientId: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  @ApiProperty({
    type: Date,
    example: '2024-01-01T08:00:00Z',
    description: 'The start date of the appointment',
  })
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  @ApiProperty({
    type: Date,
    example: '2024-01-01T17:00:00Z',
    description: 'The end date of the appointment',
  })
  endDate: Date;
}
