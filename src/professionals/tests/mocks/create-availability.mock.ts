import { CreateAvailabilityDto } from 'src/professionals/dto/create-availability.dto';

export const createAvailabilityMock: CreateAvailabilityDto = {
  professionalId: '1D67H',
  availabilities: [
    {
      startDate: new Date('2024-06-11T10:00:00Z'),
      endDate: new Date('2024-06-11T11:00:00Z'),
    },
    {
      startDate: new Date('2024-06-11T14:00:00Z'),
      endDate: new Date('2024-06-11T16:00:00Z'),
    },
  ],
};

export const createAvailabilityWrongMock: CreateAvailabilityDto = {
  professionalId: '1D67H',
  availabilities: [
    {
      startDate: new Date('2024-06-11T11:00:00Z'),
      endDate: new Date('2024-06-11T10:00:00Z'),
    },
  ],
};
