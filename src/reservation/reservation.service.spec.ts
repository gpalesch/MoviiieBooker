import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Reservation } from 'src/entity/reservation.entity';
import { ReservationDto } from 'src/dto/reservation.dto';

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: Repository<Reservation>;

  const mockReservationRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      mockReservationRepository.findOne.mockResolvedValue(null); 
      
      mockReservationRepository.save.mockResolvedValue(mockReservation);

      const result = await service.createReservation(reservationDto, {
        user: { sub: 1 },
      });

      expect(result).toEqual(mockReservation);
      expect(mockReservationRepository.save).toHaveBeenCalledWith({
        ...reservationDto,
        user_id: 1,
      });
    });

    it('should throw BadRequestException if reservation already exists within the time frame', async () => {
      const reservationDto: ReservationDto = {
        date: new Date('2025-04-10T10:00:00Z'),
        movie_id: 1,
      };

      const mockExistingReservation = {
        reservation_id: 1,
        date: new Date('2025-04-10T10:00:00Z'),
        user_id: 1,
        movie_id: 1,
      };

      mockReservationRepository.findOne.mockResolvedValue(mockExistingReservation);

      try {
        await service.createReservation(reservationDto, {
          user: { sub: 1 },
        });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe("You'already effected a reservation during that time slot");
      }
    });
  });

  describe('reservationsUser', () => {
    it('should return reservations for the user', async () => {
      const mockReservations = [
        { reservation_id: 1, date: new Date('2025-04-10T10:00:00Z'), movie_id: 1, user_id: 1 },
      ];

      mockReservationRepository.find.mockResolvedValue(mockReservations);

      const result = await service.reservationsUser({ user: { sub: 1 } });
      expect(result).toEqual(mockReservations);
    });

    it('should throw NotFoundException if no reservations are found for the user', async () => {
      mockReservationRepository.find.mockResolvedValue([]);

      try {
        await service.reservationsUser({ user: { sub: 1 } });
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

      mockReservationRepository.findOneBy.mockResolvedValue(mockReservation);
      mockReservationRepository.remove.mockResolvedValue(mockReservation);

      const result = await service.deleteReservation(1);
      expect(result).toEqual('Successfully deleted');
      expect(mockReservationRepository.remove).toHaveBeenCalledWith(mockReservation);
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      mockReservationRepository.findOneBy.mockResolvedValue(null);

      try {
        await service.deleteReservation(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe("You can't delete a reservation that doesn't exist");
      }
    });
  });
});
