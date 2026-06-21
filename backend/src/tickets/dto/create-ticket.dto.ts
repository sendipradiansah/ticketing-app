// 1. Baris ini untuk menghilangkan merah pada @ApiProperty
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// 2. Baris ini untuk menghilangkan merah pada @IsString, @IsNotEmpty, dll
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class CreateTicketDto {
  @ApiProperty({ example: 'Aplikasi force close saat login' })
  @IsString()
  @IsNotEmpty({ message: 'Judul tiket tidak boleh kosong!' })
  title!: string; // <-- Tambahkan tanda seru di sini

  @ApiProperty({ example: 'Technical' })
  @IsString()
  @IsNotEmpty({ message: 'Kategori harus diisi!' })
  category!: string; // <-- Tambahkan tanda seru di sini

  @ApiProperty({ enum: TicketPriority, example: 'HIGH' })
  @IsEnum(TicketPriority)
  @IsNotEmpty()
  priority!: string; // <-- Tambahkan tanda seru di sini

  @ApiProperty({ example: 'Saat saya klik tombol A...' })
  @IsString()
  @IsNotEmpty()
  description!: string; // <-- Tambahkan tanda seru di sini

  @ApiPropertyOptional({ example: 'http://link.gambar.com/error.jpg' })
  @IsString()
  @IsOptional()
  attachmentUrl?: string; // <-- Untuk yang opsional, biarkan memakai tanda tanya (?)
}