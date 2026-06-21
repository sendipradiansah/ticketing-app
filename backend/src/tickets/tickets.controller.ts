import { Controller, Get, Post, Body, Patch, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Tickets') 
@ApiBearerAuth()    
@Controller('tickets')
@UseGuards(AuthGuard, RolesGuard) 
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // 1. MEMBUAT TIKET BARU (MENDUKUNG UPLOAD FILE)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `file-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Membuat tiket keluhan baru dengan lampiran (Role: USER)' })
  @ApiResponse({ status: 201, description: 'Tiket berhasil dibuat.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Aplikasi force close saat login' },
        category: { type: 'string', example: 'Technical' },
        priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], example: 'HIGH' },
        description: { type: 'string', example: 'Detail kronologi masalah...' },
        file: { type: 'string', format: 'binary', description: 'Upload file screenshot error' },
      },
    },
  })
  create(
    @Body() createTicketDto: CreateTicketDto, 
    @GetUser('sub') userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) { 
    const attachmentUrl = file ? `http://localhost:3000/uploads/${file.filename}` : null;
    return this.ticketsService.create(createTicketDto, userId, attachmentUrl);
  }

  // 2. MELIHAT DAFTAR TIKET
  @Get()
  @ApiOperation({ summary: 'Melihat semua tiket (User melihat miliknya, Admin melihat semua)' })
  findAll(@GetUser() user: any) {
    return this.ticketsService.findAll(user);
  }

  // 3. TAMBAHAN: MENGAMBIL DAFTAR STAFF (KHUSUS ADMIN)
  @Get('staff-list')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Mengambil daftar Staff untuk delegasi tiket (Khusus ADMIN)' })
  getStaffList() {
    return this.ticketsService.getStaffList();
  }

  // 4. MELIHAT DETAIL SATU TIKET
  @Get(':id')
  @ApiOperation({ summary: 'Melihat detail tiket beserta timeline komentar & aktivitas' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.ticketsService.findOne(+id, user);
  }

  // 5. MENDELEGASIKAN TIKET
  @Patch(':id/assign')
  @Roles('ADMIN') 
  @ApiOperation({ summary: 'Mendelegasikan tiket kepada Staff tertentu (Khusus ADMIN)' })
  assignTicket(@Param('id') id: string, @Body() assignTicketDto: AssignTicketDto) { 
    return this.ticketsService.assign(+id, assignTicketDto.assignedToId);
  }

  // 6. MENGUBAH STATUS TIKET
  @Patch(':id/status')
  @Roles('ADMIN', 'STAFF') 
  @ApiOperation({ summary: 'Mengubah status pengerjaan tiket (Khusus ADMIN & STAFF)' })
  updateTicketStatus(
    @Param('id') id: string,
    @Body() updateTicketStatusDto: UpdateTicketStatusDto, 
    @GetUser() user: any,
  ) {
    return this.ticketsService.updateStatus(+id, updateTicketStatusDto.status, user);
  }

  // 7. MENAMBAHKAN KOMENTAR
  @Post(':id/comments')
  @ApiOperation({ summary: 'Menambahkan diskusi/komentar pada tiket (Semua Role)' })
  addComment(
    @Param('id') id: string,
    @Body('message') message: string,
    @GetUser('sub') userId: number,
  ) {
    return this.ticketsService.addComment(+id, userId, message);
  }
}