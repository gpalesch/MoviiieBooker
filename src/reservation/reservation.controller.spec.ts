import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationDto } from 'src/dto/reservation.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockReservationService = {
    createReservation: jest.fn(),
    reservationsUser: jest.fn(),
    deleteReservation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReservation', () => {
    it('should create a reservation successfully', async () => {
      const reservationDto: ReservationDto = {
        date: new Date('2025-04-10T10:00:00Z'),
        movie_id: 1,
      };

      const mockReservation = {
        reservation_id: 1,
        date: new Date('2025-04-10T10:00:00Z'),
        user_id: 1,
        movie_id: 1,
      };

      mockReservationService.createReservation.mockResolvedValue(mockReservation);

      const result = await controller.createReservation(reservationDto, { user: { sub: 1 } });
      expect(result).toEqual(mockReservation);
      expect(mockReservationService.createReservation).toHaveBeenCalledWith(reservationDto, { user: { sub: 1 } });
    });

    it('should throw BadRequestException if reservation cannot be created', async () => {
      const reservationDto: ReservationDto = {
        date: new Date('2025-04-10T10:00:00Z'),
        movie_id: 1,
      };

      mockReservationService.createReservation.mockRejectedValue(new BadRequestException('Invalid data'));

      try {
        await controller.createReservation(reservationDto, { user: { sub: 1 } });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('reservationsUser', () => {
    it('should return reservations for the user', async () => {
      const mockReservations = [
        { reservation_id: 1, date: new Date('2025-04-10T10:00:00Z'), movie_id: 1, user_id: 1 },
      ];

      mockReservationService.reservationsUser.mockResolvedValue(mockReservations);

      const result = await controller.reservationsUser({ user: { sub: 1 } });
      expect(result).toEqual(mockReservations);
      expect(mockReservationService.reservationsUser).toHaveBeenCalledWith({ user: { sub: 1 } });
    });

    it('should throw NotFoundException if no reservations are found for the user', async () => {
      mockReservationService.reservationsUser.mockRejectedValue(new NotFoundException("You don't have any reservations"));

      try {
        await controller.reservationsUser({ user: { sub: 1 } });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe("You don't have any reservations");
      }
    });
  });

  describe('deleteReservation', () => {
    it('should delete a reservation successfully', async () => {
      const mockReservation = {
        reservation_id: 1,
        date: new Date('2025-04-10T10:00:00Z'),
        movie_id: 1,
        user_id: 1,
      };

      mockReservationService.deleteReservation.mockResolvedValue('Successfully deleted');

      const result = await controller.deleteReservation(1);
      expect(result).toEqual('Successfully deleted');
      expect(mockReservationService.deleteReservation).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      mockReservationService.deleteReservation.mockRejectedValue(new NotFoundException("You can't delete a reservation that doesn't exist"));

      try {
        await controller.deleteReservation(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe("You can't delete a reservation that doesn't exist");
      }
    });
  });
});
