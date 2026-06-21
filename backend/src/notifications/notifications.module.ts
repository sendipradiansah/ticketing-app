import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Sesuaikan path ke PrismaModule Anda

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService], // WAJIB DI-EKSPOR agar module lain bisa pakai
})
export class NotificationsModule {}