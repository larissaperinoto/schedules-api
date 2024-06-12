import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from '../appointments.service';
import { AvailabilitiesService } from 'src/availabilities/availabilities.service';
import { SchedulesService } from 'src/schedules/schedules.service';
import { createAppointmentMock } from './mocks/create-appointment.mock';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let schedulesService: SchedulesService;
  let availabilitiesService: AvailabilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: AvailabilitiesService,
          useValue: { findByProfessionalId: jest.fn() },
        },
        {
          provide: SchedulesService,
          useValue: { insert: jest.fn(), findByRange: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    schedulesService = module.get<SchedulesService>(SchedulesService);
    availabilitiesService = module.get<AvailabilitiesService>(
      AvailabilitiesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should throw an exception if no availabilities are found', async () => {
      jest
        .spyOn(availabilitiesService, 'findByProfessionalId')
        .mockResolvedValueOnce([]);

      await expect(
        service.createAppointment(createAppointmentMock),
      ).rejects.toThrow(
        new HttpException('Time range is not available', HttpStatus.CONFLICT),
      );
    });

    it('should throw an exception if the start time is before any availability', async () => {
      jest
        .spyOn(availabilitiesService, 'findByProfessionalId')
        .mockResolvedValueOnce([
          {
            id: 1,
            professionalId: createAppointmentMock.professionalId,
            startDate: new Date('2024-06-11T11:00:00Z'),
            endDate: new Date('2024-06-11T12:00:00Z'),
          },
        ]);

      await expect(
        service.createAppointment(createAppointmentMock),
      ).rejects.toThrow(
        new HttpException('Time range is not available', HttpStatus.CONFLICT),
      );
    });

    it('should throw an exception if the end time is after any availability', async () => {
      jest
        .spyOn(availabilitiesService, 'findByProfessionalId')
        .mockResolvedValueOnce([
          {
            id: 1,
            professionalId: createAppointmentMock.professionalId,
            startDate: new Date('2024-06-11T08:00:00Z'),
            endDate: new Date('2024-06-11T09:00:00Z'),
          },
        ]);

      await expect(
        service.createAppointment(createAppointmentMock),
      ).rejects.toThrow(
        new HttpException('Time range is not available', HttpStatus.CONFLICT),
      );
    });

    it('should throw an exception if the end time is after the availability', async () => {
      jest
        .spyOn(availabilitiesService, 'findByProfessionalId')
        .mockResolvedValueOnce([
          {
            id: 1,
            professionalId: createAppointmentMock.professionalId,
            startDate: new Date('2024-06-11T09:30:00Z'),
            endDate: new Date('2024-06-11T10:30:00Z'),
          },
        ]);

      await expect(
        service.createAppointment(createAppointmentMock),
      ).rejects.toThrow(
        new HttpException('Time range is not available', HttpStatus.CONFLICT),
      );
    });

    it('should throw an exception if there is a schedule conflict', async () => {
      jest
        .spyOn(availabilitiesService, 'findByProfessionalId')
        .mockResolvedValueOnce([
          {
            id: 1,
            professionalId: createAppointmentMock.professionalId,
            startDate: new Date('2024-06-11T09:30:00Z'),
            endDate: new Date('2024-06-11T11:30:00Z'),
          },
        ]);
      jest.spyOn(schedulesService, 'findByRange').mockResolvedValueOnce([
        {
          id: '123-4576',
          clientId: '123OK',
          professionalId: createAppointmentMock.professionalId,
          startDate: new Date('2024-06-11T10:00:00Z'),
          endDate: new Date('2024-06-11T11:00:00Z'),
        },
      ]);

      await expect(
        service.createAppointment(createAppointmentMock),
      ).rejects.toThrow(
        new HttpException('Time range is not available', HttpStatus.CONFLICT),
      );
    });

    it('should insert the appointment if all checks pass', async () => {
      jest
        .spyOn(availabilitiesService, 'findByProfessionalId')
        .mockResolvedValueOnce([
          {
            id: 1,
            professionalId: createAppointmentMock.professionalId,
            startDate: new Date('2024-06-11T08:00:00Z'),
            endDate: new Date('2024-06-11T12:00:00Z'),
          },
        ]);
      jest.spyOn(schedulesService, 'findByRange').mockResolvedValueOnce([]);
      jest.spyOn(schedulesService, 'insert').mockResolvedValueOnce({} as any);

      const response = await service.createAppointment(createAppointmentMock);

      expect(schedulesService.insert).toHaveBeenCalledWith({
        ...createAppointmentMock,
        endDate: new Date('2024-06-11T10:59:00.000Z'),
      });
      expect(response.message).toBe('Appointment entered successfully');
    });
  });
});
