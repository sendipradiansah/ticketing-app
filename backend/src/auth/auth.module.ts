import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';    

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Registrasi Passport
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret_token_123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Daftarkan JwtStrategy di sini
  exports: [PassportModule, JwtStrategy], // Ekspor agar bisa dipakai modul lain
})
export class AuthModule {}