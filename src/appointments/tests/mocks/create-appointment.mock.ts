export const createAppointmentMock = {
  professionalId: '1D67H',
  clientId: '456',
  startDate: new Date('2024-06-11T10:00:00Z'),
  endDate: new Date('2024-06-11T11:00:00Z'),
};

export const createAppointmentResMock = {
  id: '',
  ...createAppointmentMock,
};
