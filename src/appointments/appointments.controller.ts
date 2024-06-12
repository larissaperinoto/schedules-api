import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('/create')
  @ApiOperation({
    summary:
      'Creates an appointment between client and professional based on available times',
  })
  @ApiCreatedResponse({ description: 'Appointment entered successfully' })
  @ApiConflictResponse({ description: 'Time range is not available' })
  createAppointment(@Body() payload: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(payload);
  }
}
