import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

// 1. Paksa sistem membaca file .env terlebih dahulu
dotenv.config();

// 2. Ambil URL dari .env, ATAU gunakan URL hardcode ini jika .env gagal terbaca.
// Ini menjamin pg-pool tidak akan pernah menerima password kosong/undefined.
const connectionString = process.env.DATABASE_URL || "postgresql://admin:password123@localhost:5432/db_ticketing?schema=public";

// 3. Buat Pool koneksi PostgreSQL
const pool = new Pool({ connectionString });

// 4. Hubungkan Pool ke Prisma Adapter
const adapter = new PrismaPg(pool);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 5. INI KUNCINYA: Prisma dengan driver adapter WAJIB menerima { adapter }
    super({ adapter }); 
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Berhasil terhubung ke Database PostgreSQL (Prisma pg-adapter Aktif)');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}