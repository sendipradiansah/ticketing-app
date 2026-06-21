import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // <-- Import Swagger
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mengizinkan folder 'uploads' diakses secara publik lewat URL
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Mengaktifkan validasi input global (jika Anda memakai class-validator)
  app.useGlobalPipes(new ValidationPipe());

  // --- KONFIGURASI SWAGGER MULAI DARI SINI ---
  const config = new DocumentBuilder()
    .setTitle('Ticketing App API')
    .setDescription('Dokumentasi lengkap API untuk sistem Helpdesk & Ticketing')
    .setVersion('1.0')
    .addBearerAuth() // Mengaktifkan gembok untuk input token JWT
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' adalah nama jalurnya
  // --- KONFIGURASI SWAGGER SELESAI ---

  // Menyalakan CORS agar backend bisa diakses oleh frontend (React/Next.js) nanti
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log(`Buku Panduan API (Swagger) tersedia di http://localhost:${port}/api`);
}
bootstrap();