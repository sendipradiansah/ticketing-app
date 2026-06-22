import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '../auth/auth.guard'; // Sesuaikan path ini! Asumsi saya AuthGuard ada di folder auth

describe('TicketsController', () => {
  let controller: TicketsController;

  const mockTicketsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    assign: jest.fn(),
    updateStatus: jest.fn(),
    addComment: jest.fn(),
    getStaffList: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    })
      // INI KUNCINYA: Timpa AuthGuard asli dengan tiruan
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<TicketsController>(TicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});