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
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  endDate: Date;
}

export class CreateAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  professionalId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AvailabilityRange)
  availabilities: AvailabilityRange[];
}
