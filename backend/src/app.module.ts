import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; // <-- Pastikan baris ini ada
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TicketsModule } from './tickets/tickets.module';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // 1. Gunakan process.cwd() agar selalu menunjuk ke root folder backend Anda
      rootPath: join(process.cwd(), 'uploads'), 
      serveRoot: '/uploads', 
      
      // 2. Matikan pencarian index.html agar tidak error saat file tidak ditemukan
      serveStaticOptions: {
        index: false,
      },
    }),
    PrismaModule, 
    AuthModule, // <-- WAJIB MASUKKAN DI SINI AGAR URL /auth/login AKTIF
    TicketsModule, 
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}