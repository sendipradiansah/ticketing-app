import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignTicketDto {
  @ApiProperty({ example: 2, description: 'ID dari Staff yang akan mengerjakan tiket ini' })
  @IsInt({ message: 'ID Staff harus berupa angka' })
  @IsNotEmpty()
  assignedToId!: number;
}