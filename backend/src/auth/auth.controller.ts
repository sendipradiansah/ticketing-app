import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { GetUser } from './get-user.decorator';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login pengguna untuk mendapatkan Token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login berhasil, mengembalikan access_token.' })
  @ApiResponse({ status: 401, description: 'Email atau password salah.' })
  login(@Body() loginDto: LoginDto) { 
    return this.authService.login(loginDto.email, loginDto.password);
  }

  // --- RUTE BARU: GET /auth/me ---
  @Get('me')
  @UseGuards(AuthGuard) // Wajib login
  @ApiBearerAuth()      // Menampilkan gembok di Swagger
  @ApiOperation({ summary: 'Mengambil data profil user yang sedang login' })
  @ApiResponse({ status: 200, description: 'Mengembalikan data user tanpa password.' })
  getProfile(@GetUser('sub') userId: any) {
    return this.authService.getProfile(+userId);
  }
}