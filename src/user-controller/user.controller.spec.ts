import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user-service/user.service';

describe('UserController', () => {
  let controller: UserController;
  let userServiceMock: any;
  let jwtServiceMock: any;

  const mockToken = 'mocked_token';

  beforeEach(async () => {
    userServiceMock = {
      login: jest.fn(),
      register: jest.fn(),
    };

    jwtServiceMock = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('register', () => {
    it('should successfully register and return a token', async () => {
      const registerDto = { email: 'test@example.com', password: 'new_password', name: 'Test User' };
      userServiceMock.register.mockResolvedValue({ token: mockToken });

      const result = await controller.register(registerDto);

      expect(result).toEqual({ token: mockToken });
      expect(userServiceMock.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw an error if the user already exists', async () => {
      const registerDto = { email: 'test@example.com', password: 'new_password', name: 'Test User' };
      userServiceMock.register.mockRejectedValue(new ConflictException('User exists already!'));

      await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully login and return a token', async () => {
      const loginDto = { email: 'test@example.com', password: 'correct_password' };
      userServiceMock.login.mockResolvedValue({ token: mockToken });

      const result = await controller.login(loginDto);

      expect(result).toEqual({ token: mockToken });
      expect(userServiceMock.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error if the user is not found', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrong_password' };
      userServiceMock.login.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the password is wrong', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrong_password' };
      userServiceMock.login.mockRejectedValue(new UnauthorizedException('Password is wrong!'));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
