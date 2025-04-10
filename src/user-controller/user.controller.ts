import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from 'src/dto/user.dto';
import { UserService } from 'src/user-service/user.service';

@ApiTags('auth')
@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @ApiOperation({
    summary: 'User registration',
    description: 'This endpoint allows a new user to register by providing their email, name, and password.',
  })
  @ApiBody({
    description: 'The registration data including email, name, and password.',
    type: RegisterDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, validation error on the registration data.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, user already exists.',
  })
  register(@Body() registerDto: RegisterDto): Promise<{ token: string }> {
    return this.userService.register(registerDto);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'User login',
    description: 'This endpoint allows a user to log in by providing their email and password.',
  })
  @ApiBody({
    description: 'The login credentials including email and password.',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has successfully logged in and received an authentication token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, incorrect email or password.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found, user does not exist.',
  })
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.userService.login(loginDto);
  }
}
