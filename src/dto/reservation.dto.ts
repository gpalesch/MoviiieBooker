import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ReservationDto {

  @ApiProperty({
    description: 'The date for a reservation',
  })
    @IsDate()
    @IsNotEmpty()
  date: Date;
  
  @ApiProperty({
    description: 'The movie id for a reservation',
  })
  @IsString()
  @IsNotEmpty()
  movie_id: number;
}


