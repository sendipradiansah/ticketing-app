import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TicketsService (Unit Test)', () => {
  let service: TicketsService;

  // 1. MOCKING DATABASE & TRANSAKSI
  const mockPrismaService = {
    ticket: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    ticketComment: {
      create: jest.fn(),
    },
    ticketActivity: {
      create: jest.fn(), // Diperlukan karena kode asli membuat log aktivitas
    },
    user: {
      findMany: jest.fn().mockResolvedValue([{ id: 100 }]), // Mock data admin untuk notifyAllAdmins
      findUnique: jest.fn(),
    },
    notification: {
      createMany: jest.fn(), // Diperlukan untuk notifyAllAdmins
    },
    // Ini adalah kunci utama untuk menembus logika $transaction di Prisma!
    $transaction: jest.fn(async (callback) => callback(mockPrismaService)),
  };

  const mockNotificationsService = {
    createNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    jest.clearAllMocks(); 
  });

  // =======================================================
  // 1. FUNGSI CREATE TICKET
  // =======================================================
  describe('create', () => {
    it('Harus berhasil membuat tiket dan memicu notifikasi massal ke admin', async () => {
      const dto = { title: 'Layar Gelap', category: 'HARDWARE', priority: 'HIGH', description: 'Monitor mati' };
      const tiketBaru = { id: 1, ...dto, status: 'OPEN', createdById: 99 };

      mockPrismaService.ticket.create.mockResolvedValue(tiketBaru);

      // Parameter 3 di kode asli adalah attachmentUrl (bisa null)
      const result = await service.create(dto, 99, null);

      expect(result).toEqual(tiketBaru);
      expect(mockPrismaService.ticket.create).toHaveBeenCalledTimes(1);
      
      // Memastikan fungsi helper notifyAllAdmins berjalan (memanggil createMany di DB)
      expect(mockPrismaService.notification.createMany).toHaveBeenCalled();
    });
  });

  // =======================================================
  // 2. FUNGSI FIND ONE (DETAIL TIKET)
  // =======================================================
  describe('findOne', () => {
    it('Harus mengembalikan tiket jika diakses oleh pembuatnya (USER)', async () => {
      const tiketDitemukan = { id: 1, title: 'Layar Gelap', createdById: 99 };
      mockPrismaService.ticket.findUnique.mockResolvedValue(tiketDitemukan);

      const result = await service.findOne(1, { role: 'USER', sub: 99 });

      expect(result).toEqual(tiketDitemukan);
    });

    it('Harus melempar ForbiddenException jika user biasa mengakses tiket orang lain', async () => {
      const tiketOrangLain = { id: 1, title: 'Layar Gelap', createdById: 88 }; // Tiket milik ID 88
      mockPrismaService.ticket.findUnique.mockResolvedValue(tiketOrangLain);

      // User dengan ID 99 mencoba mengakses
      await expect(service.findOne(1, { role: 'USER', sub: 99 })).rejects.toThrow(ForbiddenException);
    });

    it('Harus melempar NotFoundException jika tiket tidak ada', async () => {
      mockPrismaService.ticket.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999, { role: 'ADMIN', sub: 1 })).rejects.toThrow(NotFoundException);
    });
  });

  // =======================================================
  // 3. FUNGSI UPDATE STATUS
  // =======================================================
 describe('updateStatus', () => {
    it('Harus berhasil mengubah status, mencatat aktivitas, dan mengirim notifikasi', async () => {
      const tiketDitemukan = { id: 1, title: 'Layar Gelap', createdById: 99 };
      const tiketDiupdate = { ...tiketDitemukan, status: 'IN_PROGRESS' };

      mockPrismaService.ticket.findUnique.mockResolvedValue(tiketDitemukan);
      mockPrismaService.ticket.update.mockResolvedValue(tiketDiupdate);
      
      // --- KUNCI PERBAIKAN DI SINI ---
      // Kita simulasikan ada dua admin di DB (ID 100 dan ID 101)
      mockPrismaService.user.findMany.mockResolvedValue([{ id: 100 }, { id: 101 }]);

      // Anggap yang merubah adalah ADMIN dengan ID 100
      const result = await service.updateStatus(1, 'IN_PROGRESS', { sub: 100, role: 'ADMIN' });

      expect(result).toEqual(tiketDiupdate);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.ticket.update).toHaveBeenCalled();
      expect(mockPrismaService.ticketActivity.create).toHaveBeenCalled(); 
      
      // Notif personal ke pembuat tiket (ID 99) karena yang mengubah adalah Admin (ID 100)
      expect(mockNotificationsService.createNotification).toHaveBeenCalled();
      
      // Notif massal ke admin lain (ID 101) akan terpanggil karena daftar tidak kosong!
      expect(mockPrismaService.notification.createMany).toHaveBeenCalled();
    });
  });

  // =======================================================
  // 4. FUNGSI ADD COMMENT
  // =======================================================
  describe('addComment', () => {
    it('Harus menyimpan komentar dan mengirim notifikasi', async () => {
      const ticket = { id: 1, createdById: 99, assignedToId: 88 };
      mockPrismaService.ticket.findUnique.mockResolvedValue(ticket);
      
      const hasilKomentar = { id: 10, ticketId: 1, userId: 99, comment: 'Cek' };
      mockPrismaService.ticketComment.create.mockResolvedValue(hasilKomentar);

      const result = await service.addComment(1, 99, 'Cek');

      expect(result).toEqual(hasilKomentar);
      expect(mockPrismaService.ticketComment.create).toHaveBeenCalled();
      expect(mockNotificationsService.createNotification).toHaveBeenCalled(); // Notif personal
      expect(mockPrismaService.notification.createMany).toHaveBeenCalled();   // Notif admin
    });
  });
});