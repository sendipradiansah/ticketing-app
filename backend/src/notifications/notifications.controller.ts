import { Controller, Get, Patch, Param, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Pastikan path ini mengarah ke file JwtAuthGuard Anda

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // 1. Endpoint: GET /notifications
  // Mengambil data notifikasi untuk user yang sedang mengakses aplikasi
  @Get()
  getNotifications(@Request() req) {
    return this.notificationsService.getUnreadByUser(req.user.id);
  }

  // 2. Endpoint: PATCH /notifications/read-all
  // Menandai semua notifikasi milik user ini menjadi "sudah dibaca"
  @Patch('read-all')
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  // 3. Endpoint: PATCH /notifications/:id/read
  // Menandai SATU notifikasi saja menjadi "sudah dibaca"
  @Patch(':id/read')
  markAsRead(
    @Param('id', ParseIntPipe) id: number, 
    @Request() req
  ) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
}