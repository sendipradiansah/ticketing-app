import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service'; 

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // =========================================================================
  // FUNGSI BANTUAN: Mengirim notifikasi ke semua Admin sekaligus
  // =========================================================================
  private async notifyAllAdmins(message: string, excludeUserId?: number) {
    const admins = await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    const notificationsData = admins
      // Opsional: mencegah admin mendapat notif dari tindakannya sendiri
      .filter((admin) => admin.id !== excludeUserId) 
      .map((admin) => ({
        userId: admin.id,
        message,
      }));

    if (notificationsData.length > 0) {
      await this.prisma.notification.createMany({
        data: notificationsData,
      });
    }
  }

  // 1. MEMBUAT TIKET BARU
  async create(createTicketDto: CreateTicketDto, userId: number, attachmentUrl: string | null) {
    const { title, category, priority, description } = createTicketDto; 
    
    const newTicket = await this.prisma.ticket.create({
      data: {
        title,
        category,
        priority,
        description,
        attachmentUrl,
        createdById: userId, 
        status: 'OPEN',          
      },
    });

    // Panggil helper untuk notif ke semua admin
    await this.notifyAllAdmins(
      `Tiket Baru #${newTicket.id}: ${newTicket.title} (${newTicket.category})`, 
      userId
    );

    return newTicket;
  }

  // 2. MELIHAT SEMUA TIKET
  async findAll(user: any) {
    if (user.role === 'ADMIN') {
      return this.prisma.ticket.findMany({
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' }, 
      });
    }

    if (user.role === 'STAFF') {
      return this.prisma.ticket.findMany({
        where: { assignedToId: user.sub },
        include: {
          createdBy: { select: { id: true, name: true, email: true } }, 
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.ticket.findMany({
      where: { createdById: user.sub },
      include: {
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. MELIHAT DETAIL SATU TIKET
  async findOne(ticketId: number, user: any) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        assignedTo: { select: { id: true, name: true, role: true } },
        comments: {
          include: { user: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' }
        },
        activities: { 
          include: { user: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!ticket) throw new NotFoundException(`Tiket dengan ID ${ticketId} tidak ditemukan`);

    if (user.role === 'USER' && ticket.createdById !== user.sub) {
      throw new ForbiddenException('Akses ditolak.');
    }

    return ticket;
  }

  // 4. DELEGASIKAN TIKET (ADMIN)
  async assign(ticketId: number, assignedToId: number) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Tiket tidak ditemukan');

    const targetUser = await this.prisma.user.findUnique({ where: { id: assignedToId } });
    if (!targetUser || targetUser.role === 'USER') {
      throw new ForbiddenException('Target harus berupa STAFF atau ADMIN.');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.ticket.update({
        where: { id: ticketId },
        data: { assignedToId, status: 'IN_PROGRESS' },
      });

      await tx.ticketActivity.create({
        data: { ticketId, userId: targetUser.id, activity: 'STATUS_CHANGED_TO_IN_PROGRESS' },
      });

      return updatedTicket;
    });

    // 1. Pemicu Notifikasi untuk staf yang ditugaskan
    await this.notificationsService.createNotification(
      assignedToId,
      `Anda telah ditugaskan untuk menangani Tiket #${ticketId}: ${ticket.title}`
    );

    // 2. Pemicu Notifikasi BARU untuk user pembuat tiket
    await this.notificationsService.createNotification(
      ticket.createdById,
      `Kabar baik! Tiket #${ticketId} Anda saat ini sedang ditangani oleh tim kami (IN_PROGRESS).`
    );

    return result;
  }

  // 5. MENGUBAH STATUS TIKET
  async updateStatus(ticketId: number, newStatus: TicketStatus, user: any) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Tiket tidak ditemukan');

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.ticket.update({
        where: { id: ticketId },
        data: { status: newStatus },
      });

      await tx.ticketActivity.create({
        data: { ticketId, userId: user.sub, activity: `STATUS_CHANGED_TO_${newStatus}`, newStatus },
      });

      return updated;
    });

    // Pemicu Notifikasi ke pembuat tiket (jika yang mengubah bukan pembuatnya)
    if (ticket.createdById !== user.sub) {
      await this.notificationsService.createNotification(
        ticket.createdById,
        `Status Tiket #${ticketId} Anda telah diperbarui menjadi ${newStatus}`
      );
    }

    // PANGGIL HELPER: Notif ke semua admin tentang perubahan status ini
    await this.notifyAllAdmins(
      `Status Tiket #${ticketId} telah diperbarui menjadi ${newStatus}`,
      user.sub
    );

    return result;
  }

  // 6. MENAMBAHKAN KOMENTAR
  async addComment(ticketId: number, userId: number, message: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Tiket tidak ditemukan');

    const comment = await this.prisma.ticketComment.create({
      data: { ticketId, userId, comment: message },
      include: { user: { select: { id: true, name: true, role: true } } },
    });

    // Pemicu Notifikasi ke pihak lain (Pembuat tiket atau Staff yang ditugaskan)
    const targetUserId = (ticket.createdById === userId) ? ticket.assignedToId : ticket.createdById;
    if (targetUserId) {
      await this.notificationsService.createNotification(
        targetUserId,
        `Komentar baru pada Tiket #${ticketId}: "${message.substring(0, 20)}..."`
      );
    }

    // PANGGIL HELPER: Notif ke semua admin tentang komentar baru ini
    await this.notifyAllAdmins(
      `Komentar baru pada Tiket #${ticketId}: "${message.substring(0, 20)}..."`,
      userId
    );

    return comment;
  }

  // 7. Menambahkan Staff List untuk ADMIN
  async getStaffList() {
    return this.prisma.user.findMany({
      where: { 
        role: 'STAFF' 
      },
      select: { 
        id: true, 
        name: true, 
        email: true 
      },
    });
  }
}