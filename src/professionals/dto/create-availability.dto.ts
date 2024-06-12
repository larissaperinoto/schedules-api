import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  MinDate,
  ValidateNested,
} from 'class-validator';

export class AvailabilityRange {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  @ApiProperty({
    type: Date,
    example: '2024-01-01T08:00:00Z',
    description: 'The start date of the availability',
  })
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  @ApiProperty({
    type: Date,
    example: '2024-01-01T17:00:00Z',
    description: 'The end date of the availabiliy',
  })
  endDate: Date;
}

export class CreateAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: '1D67H',
    description: 'Unique professional identifier',
  })
  professionalId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AvailabilityRange)
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        startDate: {
          type: 'Date',
        },
        endDate: {
          type: 'Date',
        },
      },
    },
    description: 'Availability ranges',
  })
  availabilities: AvailabilityRange[];
}
