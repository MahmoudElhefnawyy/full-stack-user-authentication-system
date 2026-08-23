import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

// Minimal user shape returned by UsersService
const mockUser = {
  _id: 'user-id-123',
  email: 'test@example.com',
  name: 'Test User',
  password: bcrypt.hashSync('Passw0rd!', 10),
};

const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('returns a success message when email is new', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.signUp({
        email: 'new@example.com',
        name: 'New User',
        password: 'Passw0rd!',
      });

      expect(result).toEqual({ message: 'Account created successfully' });
      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
    });

    it('throws ConflictException when email is already registered', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.signUp({
          email: 'test@example.com',
          name: 'Test User',
          password: 'Passw0rd!',
        }),
      ).rejects.toThrow(ConflictException);

      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('hashes the password before saving', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      await service.signUp({
        email: 'new@example.com',
        name: 'New User',
        password: 'Passw0rd!',
      });

      const [, , savedHash] = mockUsersService.create.mock.calls[0] as [string, string, string];
      const isHashed = await bcrypt.compare('Passw0rd!', savedHash);
      expect(isHashed).toBe(true);
    });
  });

  describe('signIn', () => {
    it('returns an accessToken for valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.signIn({
        email: 'test@example.com',
        password: 'Passw0rd!',
      });

      expect(result).toEqual({ accessToken: 'signed.jwt.token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        name: mockUser.name,
      });
    });

    it('throws UnauthorizedException when user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.signIn({ email: 'nobody@example.com', password: 'Passw0rd!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.signIn({ email: 'test@example.com', password: 'WrongPass1!' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('returns the user profile from the JWT payload', () => {
      const payload = { sub: 'user-id-123', email: 'test@example.com', name: 'Test User' };
      const result = service.getProfile(payload);

      expect(result).toEqual({
        id: 'user-id-123',
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });
});
