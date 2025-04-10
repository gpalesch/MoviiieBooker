import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReservationDto {

  @ApiProperty({
    description: 'The date for a reservation',
  })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
  date: Date;
  
  @ApiProperty({
    description: 'The movie id for a reservation',
  })
  @IsNumber()
  @IsNotEmpty()
  movie_id: number;
}


