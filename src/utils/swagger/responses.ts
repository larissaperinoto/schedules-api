import { ApiProperty } from '@nestjs/swagger';

class TimeSlot {
  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;
}

export class AvailabilitiesResponse {
  @ApiProperty({ type: String, example: '1D67H' })
  professionalId: string;

  @ApiProperty({
    type: 'object',
    example: {
      '2024-01-01': [
        {
          startDate: '2024-01-01T08:00:00Z',
          endDate: '2024-01-01T10:00:00Z',
        },
      ],
    },
  })
  slots: {
    [date: string]: TimeSlot[];
  };
}
