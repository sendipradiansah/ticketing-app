# 🎟️ Panduan Lengkap Instalasi & Pengetesan Sistem Ticketing

Aplikasi ini adalah sistem manajemen ticketing (helpdesk) full-stack berbasis web yang dibangun dengan arsitektur modern. Proyek ini menggunakan **Next.js** di sisi frontend, **NestJS** di sisi backend, serta **PostgreSQL** sebagai sistem manajemen database utama yang dikelola melalui **Prisma ORM**. 

Untuk mempermudah portabilitas, seluruh layanan telah dikonfigurasi menggunakan **Docker** sehingga dapat dijalankan di komputer mana pun tanpa perlu menginstal Node.js atau PostgreSQL secara lokal secara manual.

---

## 🛠️ Persyaratan Sistem (Prerequisites)

Sebelum memulai, pastikan komputer baru yang digunakan untuk pengetesan sudah memiliki perangkat lunak berikut:
1. **Docker Desktop**: Wajib terinstal dan dalam kondisi aktif.
   * [Unduh Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. **Git**: Untuk menarik kode sumber (opsional, jika Anda menggunakan repositori).
   * [Unduh Git](https://git-scm.com/)
3. **Text Editor**: Disarankan menggunakan [Visual Studio Code](https://code.visualstudio.com/) untuk melihat atau mengedit kode.

---

## 📂 Struktur Folder Proyek

Pastikan struktur direktori proyek Anda terlihat seperti ini sebelum menjalankan perintah:
```text
ticketing-app/
├── backend/
│   ├── src/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
└── README.md

########################################################

### Tahapan Instalasi Detil (Step-by-Step) ###
# Langkah 1: Pengambilan Source Code
Buka terminal (Command Prompt, PowerShell, atau Terminal Mac/Linux) dan arahkan ke direktori tempat Anda ingin menyimpan aplikasi, lalu jalankan perintah:

git clone <url-repositori-anda>
cd ticketing-app
(Jika file dikirim dalam bentuk .zip, ekstrak file tersebut lalu buka folder utamanya melalui terminal).

# Langkah 2: Konfigurasi Environment Variables (.env)
Docker memerlukan variabel lingkungan untuk menghubungkan backend dengan database dan frontend dengan API.

1. Konfigurasi Backend:

Masuk ke folder backend.

Gandakan file .env.example dan ubah namanya menjadi .env.

Pastikan variabel DATABASE_URL mengarah ke kontainer database Docker, bukan ke localhost komputer:

Cuplikan kode
DATABASE_URL="postgresql://username:password@db:5432/nama_db?schema=public"
JWT_SECRET="rahasia_super_aman_anda"
PORT=3000

# Langkah 3: Perakitan (Build) dan Menjalankan Kontainer Docker
Kembali ke folder utama (ticketing-app), tempat file docker-compose.yml berada. Jalankan perintah perakitan tanpa menggunakan cache lama untuk memastikan kode paling bersih:

Ketikkan pada Terminal:
docker compose up --build -d
--build: Memaksa Docker untuk merakit ulang image backend dan frontend berdasarkan script terbaru.
-d: Menjalankan semua service (database, backend, frontend) di latar belakang agar terminal tidak terkunci.

Tunggu proses ini hingga selesai. Waktu perakitan pertama kali membutuhkan kuota internet karena Docker akan mengunduh base image Node.js dan PostgreSQL serta menjalankan proses instalasi library pendukung.

Langkah 4: Inisialisasi Database (Migrasi & Seeding)
Setelah kontainer sukses menyala, database PostgreSQL masih dalam keadaan kosong. Kita perlu membuat tabel dan mengisi data awal (seperti data akun Admin default).

1. Jalankan Migrasi Skema:
Perintahkan Prisma untuk membuat tabel berdasarkan struktur yang ada di schema.prisma:

Ketikkan pada Terminal:
docker exec -it ticketing-backend npx prisma db push

2. Jalankan Seed Data (Akun Default):
Masukkan data pengguna awal ke dalam database agar aplikasi bisa langsung dicoba untuk login:

Ketikkan pada Terminal:
docker exec -it ticketing-backend npx prisma db seed


🌐 Verifikasi Akses Aplikasi
Buka peramban (browser) Anda dan pastikan layanan-layanan berikut dapat diakses dengan baik:

Antarmuka Frontend (Next.js): Akses http://localhost:3001

Dokumentasi/API Backend (NestJS): Akses http://localhost:3000

🛠️ Panduan Penyelesaian Masalah (Troubleshooting)
1. Error: EADDRINUSE: address already in use :::3000
Penyebab: Port 3000 di komputer Anda sedang dipakai oleh aplikasi lain (biasanya project lokal yang lupa dimatikan).

Solusi:
Windows: Buka CMD sebagai Administrator, cari PID yang menyandera port, lalu matikan:

DOS
netstat -ano | findstr :3000
taskkill /PID <NOMOR_PID_YANG_MUNCUL> /F
Mac/Linux: Jalankan kill -9 $(lsof -t -i:3000).

Setelah dibersihkan, jalankan kembali docker compose up -d.

2. Error: Cannot find module '/app/dist/main'
Penyebab: Perintah eksekusi tidak sesuai dengan hasil build NestJS.
Solusi: Pastikan baris terakhir pada file backend/Dockerfile mengarah ke perintah start yang valid:

Dockerfile
CMD ["npm", "run", "start"]
Kemudian jalankan ulang: docker compose up --build -d backend.

3. Mereset Ulang Database Menjadi Kosong
Jika Anda ingin menghapus seluruh data dan mengulang dari nol, jalankan:

Ketikkan pada Terminal:
docker compose down -v
docker compose up -d
docker exec -it ticketing-backend npx prisma db push
docker exec -it ticketing-backend npx prisma db seed
(Peringatan: Perintah -v akan menghapus seluruh data tiket dan user secara permanen dari Docker).

🔄 Pembaruan Kode Selama Pengetesan
Jika Anda melakukan perubahan pada baris kode, Anda tidak perlu mematikan Docker secara keseluruhan. Cukup perbarui service yang bersangkutan saja:

Update Backend: docker compose up --build -d backend

Update Frontend: docker compose up --build -d frontend

# Akun Testing:
email: admin@example.com
password: password

email: user@example.com
password: password

email: user1@example.com
password: password

email: user2@example.com
password: password

email: user3@example.com
password: password

email: staff@example.com
password: password

email: staff2@example.com
password: password

# Fitur yang sudah selesai
- Authentication
- Dashboard
- Ticket Management
- Ticket List
- Ticket Detail
- Comment dan Activity Log
- Upload attachment berjalan
- Export tiket ke Excel/PDF
- Notifikasi sederhana
- Responsive mobile
- Dark mode
- API documentation menggunakan Swagger/OpenAPI
- Docker setup
- Seeder data dummy
- Clean UI dengan reusable component
- Validasi form yang rapi

# Penggunaan AI tools:
Saya menggunakan Gemini 3.1 Pro
Untuk source code saya full menggunakan bantuan AI secara bertahap pengerjaannya berdasarkan fungsi,
sedangkan saya bertindak sebagai Analyst dan fokus kepada bisnis prosesnya. 