import { Body, Controller, Delete, Get, Headers, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto } from 'src/dto/reservation.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Reservation } from 'src/entity/reservation.entity';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {

    constructor(private readonly resService: ReservationService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create new reservation' })
    @ApiResponse({
      status: 201,
      description: 'Reservation created avec success',
    })
    @ApiResponse({
      status: 400,
      description: 'Invalid data',
    })
    createReservation(@Body() reservationDto: ReservationDto, @Req() req): Promise<Reservation> {
        return this.resService.createReservation(reservationDto, req);
        }


    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Show the reservations of the connected user' })
    @ApiResponse({
        status: 200,
        description: 'List the reservations of this user',
    })
    @ApiResponse({
        status: 404,
        description: 'No reservation found for this user',
    })
    reservationsUser(@Req() req): Promise<Reservation[]> {
        return this.resService.reservationsUser(req);
        }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Cancel a reservation through the id' })
    @ApiResponse({
        status: 200,
        description: 'Reservation successfully cancelled',
    })
    @ApiResponse({
        status: 404,
        description: 'Reservation not found',
    })
    deleteReservation(@Param('id') id: number): Promise<string> {
        return this.resService.deleteReservation(id);
        }
    
}