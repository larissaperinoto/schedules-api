import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalsController } from '../professionals.controller';
import { ProfessionalsService } from '../professionals.service';
import { createAvailabilityMock } from './mocks/create-availability.mock';
import { HttpStatus } from '@nestjs/common';
import {
  findAvailabilityMock,
  findAvailabilityResMock,
} from './mocks/find-availability.mock';

describe('ProfessionalsController', () => {
  let controller: ProfessionalsController;
  let service: ProfessionalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalsController],
      providers: [
        {
          provide: ProfessionalsService,
          useValue: {
            createAvailability: jest.fn(),
            findAvailabilityByProfessional: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfessionalsController>(ProfessionalsController);
    service = module.get<ProfessionalsService>(ProfessionalsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAvailability', () => {
    it('should create an availability', async () => {
      jest
        .spyOn(service, 'createAvailability')
        .mockResolvedValue({ message: 'Availability entered successfully' });

      const response = await controller.createAvailability(
        createAvailabilityMock,
      );

      expect(response.message).toBe('Availability entered successfully');
      expect(service.createAvailability).toHaveBeenCalledTimes(1);
      expect(service.createAvailability).toHaveBeenCalledWith(
        createAvailabilityMock,
      );
    });
  });

  describe('findAvailabilityByProfessional', () => {
    it('should return availabilities for a professional', async () => {
      jest
        .spyOn(service, 'findAvailabilityByProfessional')
        .mockResolvedValueOnce(findAvailabilityResMock);

      expect(
        await controller.findAvailabilityByProfessional(
          findAvailabilityMock.professionalId,
        ),
      ).toBe(findAvailabilityResMock);
      expect(service.findAvailabilityByProfessional).toHaveBeenCalledWith({
        professionalId: findAvailabilityMock.professionalId,
      });
    });
  });
});
