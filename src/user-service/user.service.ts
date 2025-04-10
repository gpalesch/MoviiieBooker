import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
      ) {}

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const email = loginDto.email;
        const password = loginDto.password;
        const existingUser = await this.findByMail(email);

        if (!existingUser) {
            throw new NotFoundException('User not found');
            }

        const isPasswordValid = await bcrypt.compare(password, existingUser!.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Password is wrong!');
        }

        const payload = { sub: existingUser!.user_id, email: existingUser!.email };

        return {
            token: await this.jwtService.signAsync(payload),
          };


    }


    async register(registerDto: RegisterDto): Promise<{token: string}> {
        const existingUser = await this.findByMail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('User exist already!');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = await this.userRepository.save({ ...registerDto, password: hashedPassword });

        const payload = { sub: newUser!.user_id, email: newUser!.email };

        return {
            token: await this.jwtService.signAsync(payload),
          };
    }

    async findByMail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
      }
}
