import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Memalsukan library bcrypt
jest.mock('bcrypt');

describe('AuthService (Unit Test)', () => {
  let service: AuthService;

  // 1. SIAPKAN MOCK
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mocked_jwt_token_xyz'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService }, 
        { provide: JwtService, useValue: mockJwtService },       
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks(); 
  });

  // =======================================================
  // 1. FUNGSI LOGIN
  // =======================================================
  describe('login', () => {
    it('Harus berhasil login dan mengembalikan access_token serta data user', async () => {
      const userSimulasi = {
        id: 1,
        email: 'admin@ticketing.com',
        password: 'hashed_password_123', 
        name: 'Admin Toko',
        role: 'ADMIN',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(userSimulasi);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('admin@ticketing.com', 'password123');

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toEqual('mocked_jwt_token_xyz');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(result.user.name).toEqual('Admin Toko');
    });

    it('Harus melempar UnauthorizedException jika password salah', async () => {
      const userSimulasi = {
        id: 1,
        email: 'admin@ticketing.com',
        password: 'hashed_password_123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(userSimulasi);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password salah

      await expect(service.login('admin@ticketing.com', 'salahpassword')).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('Harus melempar UnauthorizedException jika email tidak ditemukan di database', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login('tidak-ada@email.com', 'password123')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  // =======================================================
  // 2. FUNGSI GET PROFILE
  // =======================================================
  describe('getProfile', () => {
    it('Harus mengembalikan data profil user jika ID ditemukan', async () => {
      // Ingat: fungsi asli mengecualikan password
      const profilUser = {
        id: 1,
        name: 'Admin Toko',
        email: 'admin@ticketing.com',
        role: 'ADMIN',
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(profilUser);

      const result = await service.getProfile(1);

      expect(result).toEqual(profilUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { 
          id: true, 
          name: true, 
          email: true, 
          role: true, 
          createdAt: true 
        },
      });
    });

    it('Harus melempar NotFoundException jika user tidak ditemukan', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(NotFoundException);
    });
  });
});