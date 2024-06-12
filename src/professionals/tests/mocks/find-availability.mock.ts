import { FindAvailabilityProfessionalDto } from 'src/professionals/dto/find-availability.dto';

export const findAvailabilityMock: FindAvailabilityProfessionalDto = {
  professionalId: '1D67H',
};

export const findAvailabilityResMock = {
  professionalId: '1D67H',
  availability: [],
};

export const availabilityByProfessionalMock = {
  professionalId: '1D67H',
  availability: {
    '2024-06-11': [
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '12:00', endTime: '13:00' },
      { startTime: '13:00', endTime: '14:00' },
    ],
  },
};
