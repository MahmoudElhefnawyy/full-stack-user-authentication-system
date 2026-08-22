import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<{ message: string }> {
    // 1. Check if email already exists
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    // 2. Hash the password (10 salt rounds = industry standard)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Save user to DB
    await this.usersService.create(dto.email, dto.name, hashedPassword);

    return { message: 'Account created successfully' };
  }

  async signIn(dto: SignInDto): Promise<{ accessToken: string }> {
    // 1. Find user by email
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate JWT token
    const payload = { sub: user._id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  getProfile(user: { sub: string; email: string; name: string }) {
    return {
      id: user.sub,
      email: user.email,
      name: user.name,
    };
  }
}
