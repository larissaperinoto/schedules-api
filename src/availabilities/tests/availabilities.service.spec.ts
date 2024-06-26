import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { AvailabilitiesService } from '../availabilities.service';
import { Availability } from '../../database/entity/availability.entity';
import { MockType } from '../../utils/types/mockType';

const availabilityMock = {
  professionalId: '1D67H',
  startDate: new Date('2024-08-12T10:00:00Z'),
  endDate: new Date('2024-06-11T15:00:00Z'),
};

describe('AvailabilitiesService', () => {
  let service: AvailabilitiesService;
  let repository: MockType<Repository<Availability>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilitiesService,
        {
          provide: getRepositoryToken(Availability),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get(getRepositoryToken(Availability));
    service = module.get<AvailabilitiesService>(AvailabilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('insert', () => {
    it('should insert a new availability', async () => {
      const insertSpy = jest
        .spyOn(repository, 'insert')
        .mockResolvedValueOnce(availabilityMock as never);

      await service.insert(availabilityMock);

      expect(insertSpy).toHaveBeenCalledWith(availabilityMock);
    });

    it('should send an error message', async () => {
      jest
        .spyOn(repository, 'insert')
        .mockRejectedValueOnce(new Error() as never);

      try {
        await service.insert(availabilityMock);
      } catch (e) {
        expect(e.message).toEqual('Unable to enter availability data');
        expect(e.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('findByProfessionalId', () => {
    it('should find availabilities by professionalId', async () => {
      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValueOnce([availabilityMock] as never);

      await service.findByProfessionalId({
        professionalId: availabilityMock.professionalId,
      });

      expect(findSpy).toHaveBeenCalledWith({
        where: { professionalId: availabilityMock.professionalId },
      });
    });

    it('should find availabilities by professionalId with date range', async () => {
      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValueOnce([{}] as never);

      await service.findByProfessionalId(availabilityMock);

      expect(findSpy).toHaveBeenCalledWith({
        where: [
          { professionalId: availabilityMock.professionalId },
          { startDate: MoreThan(availabilityMock.startDate) },
          { endDate: LessThan(availabilityMock.endDate) },
        ],
        order: { startDate: 'ASC' },
      });
    });
  });

  describe('removeAvailability', () => {
    it('should remove availability for a professional within a date range', async () => {
      const professionalId = '1D67H';
      const startDate = new Date('2024-01-01T00:00:00.000Z');
      const endDate = new Date('2024-01-01T23:59:59.999Z');

      const deleteMock = jest.fn().mockResolvedValue({ affected: 1 });
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: deleteMock,
      } as any);

      await service.removeAvailability({ professionalId, startDate, endDate });

      expect(deleteMock).toHaveBeenCalled();
    });
  });

  describe('findAvailabilities', () => {
    it('should return availabilities for valid inputs', async () => {
      const mockDto = {
        startDate: new Date('2024-06-15T00:00:00.000Z'),
        endDate: new Date('2024-06-15T23:59:59.999Z'),
        professionalId: '123',
      };

      const mockResult = [
        {
          id: 1,
          startDate: mockDto.startDate,
          endDate: mockDto.endDate,
          professionalId: mockDto.professionalId,
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(mockResult as never);

      const result = await service.findAvailabilities(mockDto);
      expect(result).toEqual(mockResult);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });
});
