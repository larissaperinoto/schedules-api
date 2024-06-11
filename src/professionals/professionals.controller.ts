import { Body, Controller, Post } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post('/availability/create')
  createAvailability(@Body() payload: CreateAvailabilityDto) {
    return this.professionalsService.createAvailability(payload);
  }
}
