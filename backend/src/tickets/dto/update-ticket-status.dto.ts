import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '@prisma/client';


export class UpdateTicketStatusDto {
  @ApiProperty({ 
    enum: TicketStatus, 
    example: TicketStatus.IN_PROGRESS, 
    description: 'Status pengerjaan tiket saat ini' 
  })
  @IsEnum(TicketStatus, { message: 'Status harus OPEN, IN_PROGRESS, DONE, atau REJECTED' })
  @IsNotEmpty()
  status!: TicketStatus;
}