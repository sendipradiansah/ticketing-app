// backend/src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'admin@example.com', 
    description: 'Alamat email untuk login' 
  }) // <-- Dekorator ini WAJIB ada agar muncul di Swagger
  @IsEmail({}, { message: 'Format email tidak valid!' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ 
    example: 'password', 
    description: 'Kata sandi akun' 
  }) // <-- Dekorator ini WAJIB ada agar muncul di Swagger
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}