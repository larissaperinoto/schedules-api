import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalsController } from '../professionals.controller';
import { ProfessionalsService } from '../professionals.service';
import { createAvailabilityMock } from './mocks/create-availability.mock';
import { availabilityByProfessionalMock } from './mocks/find-availability.mock';

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
            findAvailabilities: jest.fn(),
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

  describe('findAvailabilities', () => {
    it('should return availabilities for all professionals', async () => {
      jest
        .spyOn(service, 'findAvailabilities')
        .mockResolvedValueOnce([availabilityByProfessionalMock]);

      expect(
        await controller.findAvailabilities(
          null,
          new Date('2024-06-11T10:00:00Z'),
          new Date('2024-06-13T23:00:00Z'),
        ),
      ).toStrictEqual([availabilityByProfessionalMock]);
      expect(service.findAvailabilities).toHaveBeenCalledWith({
        professionalId: null,
        startDate: new Date('2024-06-11T10:00:00Z'),
        endDate: new Date('2024-06-13T23:00:00Z'),
      });
    });
  });
});
