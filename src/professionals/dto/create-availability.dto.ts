import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  MinDate,
  ValidateNested,
} from 'class-validator';

export class AvailabilityRange {
  @Matches(/^(?:[01]\d|2[0-3]):(00|30)$/, {
    message: 'Enter a time in hh:mm format',
  })
  startHour: string;

  @Matches(/^(?:[01]\d|2[0-3]):(00|30)$/, {
    message: 'Enter a time in hh:mm format',
  })
  endHour: string;
}

export class CreateAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  professionalId: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  date: Date;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AvailabilityRange)
  availabilities: AvailabilityRange[];
}
