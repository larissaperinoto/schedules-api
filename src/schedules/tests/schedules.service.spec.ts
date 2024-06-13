import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { SchedulesService } from '../schedules.service';
import { Schedule } from '../../database/entity/schedule.entity';
import { MockType } from '../../utils/types/mockType';
import { HttpStatus } from '@nestjs/common';

const scheduleMock = {
  professionalId: '1D67H',
  clientId: '45OUJ',
  startDate: new Date('2024-06-11T10:00:00Z'),
  endDate: new Date('2024-06-11T11:00:00Z'),
};

describe('SchedulesService', () => {
  let service: SchedulesService;
  let repository: MockType<Repository<Schedule>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        {
          provide: getRepositoryToken(Schedule),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get(getRepositoryToken(Schedule));

    service = module.get<SchedulesService>(SchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('insert', () => {
    it('should insert a new schedule', async () => {
      const insertSpy = jest
        .spyOn(repository, 'insert')
        .mockResolvedValueOnce(scheduleMock as never);

      await service.insert(scheduleMock);

      expect(insertSpy).toHaveBeenCalledWith(scheduleMock);
    });

    it('should send an error message', async () => {
      jest
        .spyOn(repository, 'insert')
        .mockRejectedValueOnce(new Error() as never);

      try {
        await service.insert(scheduleMock);
      } catch (e) {
        expect(e.message).toEqual('Unable to enter a schedule');
        expect(e.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('findBetweenDateRange', () => {
    it('should find schedules within a date range', async () => {
      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue([scheduleMock] as never);

      await service.findBetweenDateRange(scheduleMock);

      expect(findSpy).toHaveBeenCalledWith({
        where: [
          {
            startDate: Between(scheduleMock.startDate, scheduleMock.endDate),
          },
          {
            endDate: Between(scheduleMock.startDate, scheduleMock.endDate),
          },
        ],
      });
    });
  });

  describe('findByProfessionalId', () => {
    it('should find schedules by professionalId', async () => {
      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue([scheduleMock] as never);

      await service.findByProfessionalId(scheduleMock.professionalId);

      expect(findSpy).toHaveBeenCalledWith({
        where: { professionalId: scheduleMock.professionalId },
      });
    });
  });
});
