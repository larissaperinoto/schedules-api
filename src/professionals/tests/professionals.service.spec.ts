import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalsService } from '../professionals.service';
import { SchedulesService } from 'src/schedules/schedules.service';
import { AvailabilitiesService } from 'src/availabilities/availabilities.service';
import {
  createAvailabilityMock,
  createAvailabilityWrongMock,
} from './mocks/create-availability.mock';
import { HttpException, HttpStatus } from '@nestjs/common';
import { availabilityByProfessionalMock } from './mocks/find-availability.mock';

describe('ProfessionalsService', () => {
  let service: ProfessionalsService;
  let schedulesService: SchedulesService;
  let availabilitiesService: AvailabilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionalsService,
        {
          provide: AvailabilitiesService,
          useValue: { findByProfessionalId: jest.fn(), insert: jest.fn() },
        },
        {
          provide: SchedulesService,
          useValue: {
            findByRange: jest.fn(),
            findByProfessionalId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfessionalsService>(ProfessionalsService);
    schedulesService = module.get<SchedulesService>(SchedulesService);
    availabilitiesService = module.get<AvailabilitiesService>(
      AvailabilitiesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAvailability', () => {
    it('should throw an error if endDate is before startDate', async () => {
      await expect(
        service.createAvailability(createAvailabilityWrongMock),
      ).rejects.toThrow(
        new HttpException(
          'The end date cannot be greater than the start date',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should create availabilities if all checks pass', async () => {
      jest
        .spyOn(availabilitiesService, 'insert')
        .mockResolvedValue({} as never);

      await service.createAvailability(createAvailabilityMock);

      expect(availabilitiesService.insert).toHaveBeenCalledTimes(2);
      expect(availabilitiesService.insert).toHaveBeenNthCalledWith(1, {
        professionalId: createAvailabilityMock.professionalId,
        startDate: createAvailabilityMock.availabilities[0].startDate,
        endDate: createAvailabilityMock.availabilities[0].endDate,
      });
      expect(availabilitiesService.insert).toHaveBeenNthCalledWith(2, {
        professionalId: createAvailabilityMock.professionalId,
        startDate: createAvailabilityMock.availabilities[1].startDate,
        endDate: createAvailabilityMock.availabilities[1].endDate,
      });
    });
  });

  describe('findAvailabilityByProfessional', () => {
    it('should return available slots for a professional', async () => {
      const professionalId = createAvailabilityMock.professionalId;
      jest
        .spyOn(availabilitiesService, 'findByProfessionalId')
        .mockResolvedValueOnce([
          {
            id: 1,
            professionalId,
            startDate: new Date('2024-06-11T10:00:00Z'),
            endDate: new Date('2024-06-11T14:00:00Z'),
          },
        ]);
      jest
        .spyOn(schedulesService, 'findByProfessionalId')
        .mockResolvedValueOnce([
          {
            id: '1',
            clientId: '456',
            professionalId,
            startDate: new Date('2024-06-11T11:00:00Z'),
            endDate: new Date('2024-06-11T12:00:00Z'),
          },
        ]);

      const result = await service.findAvailabilityByProfessional({
        professionalId,
      });

      expect(result).toEqual(availabilityByProfessionalMock);

      expect(availabilitiesService.findByProfessionalId).toHaveBeenCalledWith({
        professionalId,
      });

      expect(schedulesService.findByProfessionalId).toHaveBeenCalledWith(
        professionalId,
      );
    });
  });
});
