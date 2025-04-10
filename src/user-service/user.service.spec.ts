import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepositoryMock: any;
  let jwtServiceMock: any;

  const mockUser = {
    user_id: 1,
    email: 'test@example.com',
    password: 'hashed_password',
  };

  beforeEach(async () => {
    userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    jwtServiceMock = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('login', () => {
    it('should successfully login and return a token', async () => {
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValue('mocked_token');

      const loginDto = { email: 'test@example.com', password: 'correct_password' };

      const result = await service.login(loginDto);

      expect(result).toEqual({ token: 'mocked_token' });
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: loginDto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtServiceMock.signAsync).toHaveBeenCalled();
    });

    it('should throw an error if the user is not found', async () => {
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(null);

      const loginDto = { email: 'test@example.com', password: 'correct_password' };

      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the password is incorrect', async () => {
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const loginDto = { email: 'test@example.com', password: 'wrong_password' };

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should successfully register a new user and return a token', async () => {
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password');
      jest.spyOn(userRepositoryMock, 'save').mockResolvedValue(mockUser as any);
      jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValue('mocked_token');

      const registerDto = { email: 'test@example.com', password: 'new_password', name: 'Test User' };

      const result = await service.register(registerDto);

      expect(result).toEqual({ token: 'mocked_token' });
      expect(userRepositoryMock.save).toHaveBeenCalledWith({ ...registerDto, password: 'hashed_password' });
      expect(jwtServiceMock.signAsync).toHaveBeenCalled();
    });

    it('should throw an error if the user already exists', async () => {
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(mockUser as any);

      const registerDto = { email: 'test@example.com', password: 'new_password', name: 'Test User' };

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });
});
