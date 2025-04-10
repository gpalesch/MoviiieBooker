import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Mail of user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Name of user',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Password for user with at least 6 caracters',
  })
  @IsNotEmpty()
  @MinLength(6, {
    message: 'The password must have at least 6 caracters',
  })
  password: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Mail of user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of the user which corresponds to the password upon inscription',
  })
  @IsNotEmpty()
  password: string;
}


