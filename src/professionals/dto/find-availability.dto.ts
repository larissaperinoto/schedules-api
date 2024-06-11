import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  professionalId: string;

  @IsOptional()
  date: Date;
}
