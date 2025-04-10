import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationDto } from 'src/dto/reservation.dto';
import { Reservation } from 'src/entity/reservation.entity';
import { Between, Repository } from 'typeorm';


@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private resRepository: Repository<Reservation>
    ) {}

    async deleteReservation(id: number): Promise<string> {
        const existingReservation = await this.resRepository.findOneBy({
                reservation_id: id
          })
        
          if (!existingReservation) {
            throw new NotFoundException("You can't delete a reservation that doesn't exist");
          }
        
        await this.resRepository.remove(existingReservation);

        return "Successfully deleted"
    }

    async reservationsUser(req): Promise<Reservation[]> {
        const userId = req.user.sub;
        const allReservations = await this.resRepository.find({
            where: { 
                user_id: userId,
             },
          })
        
        if (!allReservations || allReservations.length === 0) {
            throw new NotFoundException("You don't have any reservations");
        }  

        return allReservations;
    }

    async createReservation(reservationDto: ReservationDto, req): Promise<Reservation> {
        const startDate = new Date(reservationDto.date);
        const userId = req.user.sub;

        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        const beforeStartDate = new Date(startDate.getTime() - 2 * 60 * 60 * 1000);

        const existingReservation = await this.resRepository.findOne({
            where: { 
                user_id: userId,
                date: Between(beforeStartDate, endDate)
             },
          })

        if (existingReservation) {
            throw new BadRequestException("You'already effected a reservation during that time slot")
        }

        const newReservation = await this.resRepository.save({ ...reservationDto, user_id: userId });

        return newReservation;
        
    }

}
