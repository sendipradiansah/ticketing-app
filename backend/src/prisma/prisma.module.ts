import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Menjadikan Prisma bisa dipakai di mana saja tanpa perlu di-import berulang-ulang
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Penting agar Auth & Tickets bisa memakainya
})
export class PrismaModule {}