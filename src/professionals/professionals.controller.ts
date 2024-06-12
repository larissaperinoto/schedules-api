import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post('/availability/create')
  @ApiOperation({ summary: 'Creates availability for a professional' })
  @ApiCreatedResponse({ description: 'Availability entered successfully' })
  @ApiBadRequestResponse({
    description: 'The end date cannot be greater than the start date',
  })
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
