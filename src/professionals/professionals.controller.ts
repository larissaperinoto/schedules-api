import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { AvailabilitiesResponse } from 'src/utils/swagger/responses';
import { ProfessionalsService } from './professionals.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

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

  @Get('/availabilities')
  @ApiOperation({ summary: 'Find availabilities for professionals' })
  @ApiQuery({
    name: 'professionalId',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
  })
  @ApiOkResponse({
    type: [AvailabilitiesResponse],
  })
  findAvailabilities(
    @Query('professionalId') professionalId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.professionalsService.findAvailabilities({
      professionalId,
      startDate,
      endDate,
    });
  }
}
