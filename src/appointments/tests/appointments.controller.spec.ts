import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from '../appointments.controller';
import { AppointmentsService } from '../appointments.service';
import {
  createAppointmentMock,
  createAppointmentResMock,
} from './mocks/create-appointment.mock';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            createAppointment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should create an appointment', async () => {
      jest
        .spyOn(service, 'createAppointment')
        .mockResolvedValue(createAppointmentResMock as never);

      await controller.createAppointment(createAppointmentMock);

      expect(service.createAppointment).toHaveBeenCalledWith(
        createAppointmentMock,
      );
    });
  });
});
