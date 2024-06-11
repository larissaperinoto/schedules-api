import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilitiesService } from './availabilities.service';

describe('AvailabilitiesService', () => {
  let service: AvailabilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailabilitiesService],
    }).compile();

    service = module.get<AvailabilitiesService>(AvailabilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
