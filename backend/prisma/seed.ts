import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Baca file .env
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('password', 10);

  // 1. Buat Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  // 2. Buat Staff
  const staff = await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      name: 'Staff Support',
      email: 'staff@example.com',
      password: passwordHash,
      role: 'STAFF',
    },
  });

  // 2. Buat Staff
  const staff2 = await prisma.user.upsert({
    where: { email: 'staff2@example.com' },
    update: {},
    create: {
      name: 'Staff Support 2',
      email: 'staff2@example.com',
      password: passwordHash,
      role: 'STAFF',
    },
  });

  // 3. Buat User
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: passwordHash,
      role: 'USER',
    },
  });

   // 3. Buat User
  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      name: 'Regular User 2',
      email: 'user2@example.com',
      password: passwordHash,
      role: 'USER',
    },
  });

   // 3. Buat User
  const user3 = await prisma.user.upsert({
    where: { email: 'user3@example.com' },
    update: {},
    create: {
      name: 'Regular User 3',
      email: 'user3@example.com',
      password: passwordHash,
      role: 'USER',
    },
  });

  console.log('✅ Akun pengguna berhasil disiapkan.');

  // 4. Siapkan 10 Data Tiket Dummy
  const ticketsData = [
    {
      title: 'Monitor berkedip saat merender grafis',
      category: 'Hardware',
      priority: 'MEDIUM',
      status: 'OPEN',
      description: 'Layar sekunder selalu berkedip hijau saat aplikasi desain dibuka. Kabel HDMI sudah diganti tapi masalah persisten.',
      createdById: user.id,
    },
    {
      title: 'Akses login ke Portal HR ditolak',
      category: 'Account',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      description: 'Password dinyatakan salah padahal sudah direset oleh sistem kemarin sore.',
      createdById: user.id,
      assignedToId: staff.id, // Di-assign ke staff
    },
    {
      title: 'Koneksi uplink lantai 3 terputus',
      category: 'Network',
      priority: 'CRITICAL',
      status: 'OPEN',
      description: 'Satu divisi kehilangan akses intranet karena router di ruang server C sepertinya mati total.',
      createdById: user.id,
    },
    {
      title: 'Lisensi Software Desain Expired',
      category: 'Software',
      priority: 'LOW',
      status: 'DONE',
      description: 'Muncul popup aktivasi setiap kali mencoba menyimpan file project baru.',
      createdById: user2.id,
      assignedToId: staff2.id, // Di-assign ke admin
    },
    {
      title: 'Printer utama kehabisan tinta hitam',
      category: 'Hardware',
      priority: 'MEDIUM',
      status: 'OPEN',
      description: 'Lampu indikator menyala merah, mohon segera diisi ulang untuk cetak dokumen klien.',
      createdById: user2.id,
    },
    {
      title: 'Koneksi VPN AnyConnect Error 403',
      category: 'Network',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      description: 'Gagal melakukan tunneling dari jaringan rumah. Memunculkan error code 403.',
      createdById: user2.id,
      assignedToId: staff2.id,
    },
    {
      title: 'Request akses folder Shared Drive',
      category: 'Account',
      priority: 'LOW',
      status: 'REJECTED',
      description: 'Mohon bukakan akses read/write untuk folder Q3 Campaign.',
      createdById: user3.id,
      assignedToId: staff.id,
    },
    {
      title: 'Database Export memicu Force Close',
      category: 'Software',
      priority: 'CRITICAL',
      status: 'OPEN',
      description: 'Fungsi export report bulanan selalu membuat aplikasi tertutup paksa. Data sangat urgent.',
      createdById: user3.id,
    },
    {
      title: 'Keyboard mekanik tombol spasi macet',
      category: 'Hardware',
      priority: 'LOW',
      status: 'DONE',
      description: 'Tombol keras dan double-type. Telah diselesaikan dengan penggantian unit baru.',
      createdById: user.id,
      assignedToId: staff.id,
    },
    {
      title: 'Email client tersaring ke Spam',
      category: 'Other',
      priority: 'MEDIUM',
      status: 'OPEN',
      description: 'Komunikasi email dari domain klien selalu masuk ke folder junk, filter rules tidak berfungsi.',
      createdById: user.id,
    }
  ];

  console.log('Memulai injeksi 10 baris tiket ke dalam databank...');

  await prisma.ticketActivity.deleteMany({});
  
  await prisma.ticket.deleteMany({});
  console.log('Menghapus data tiket lama...');

  // 5. Eksekusi Injeksi Tiket
  // as any digunakan agar TypeScript tidak memprotes validasi tipe enum strict dari Prisma
  await prisma.ticket.createMany({
    data: ticketsData as any,
  });

  console.log('✅ Seeder berhasil dijalankan sepenuhnya!');
  
  // Tampilkan ringkasan data yang di-generate agar mudah dikonfirmasi di terminal
  console.log({ 
    admin: admin.email, 
    staff: staff.email, 
    staff2: staff2.email, 
    user: user.email, 
    user2: user2.email, 
    user3: user3.email, 
    ticketsGenerated: ticketsData.length 
  }); 
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });