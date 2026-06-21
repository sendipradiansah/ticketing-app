import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Sesuaikan path ini jika lokasi PrismaService Anda berbeda

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Dijalankan oleh sistem (misal: TicketsService) untuk membuat notifikasi baru
  async createNotification(userId: number, message: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
  }

  // 2. Mengambil riwayat notifikasi untuk user yang sedang login (Diurutkan dari yang terbaru)
  async getUnreadByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Opsional: Membatasi hanya 50 notifikasi terakhir agar respons API cepat
    });
  }

  // 3. Mengubah status semua notifikasi milik user menjadi "Sudah dibaca" (isRead: true)
  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false, // Hanya update yang belum dibaca saja untuk efisiensi
      },
      data: {
        isRead: true,
      },
    });
  }

  // 4. Mengubah status SATU notifikasi spesifik menjadi "Sudah dibaca"
  async markAsRead(id: number, userId: number) {
    return this.prisma.notification.update({
      where: {
        id: id,
        userId: userId, // Proteksi keamanan: Memastikan notifikasi ini benar-benar milik user yang sedang login
      },
      data: {
        isRead: true,
      },
    });
  }
}