import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post('/availability/create')
  createAvailability(@Body() payload: CreateAvailabilityDto) {
    return this.professionalsService.createAvailability(payload);
  }

  @Get('/availability/:professionalId')
  findAvailabilityByProfessional(
    @Param('professionalId') professionalId: string,
  ) {
    return this.professionalsService.findAvailabilityByProfessional({
      professionalId,
    });
  }
}
