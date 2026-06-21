import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ 
    example: 'Tolong segera diproses ya, aplikasi sedang down.', 
    description: 'Isi pesan komentar' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Komentar tidak boleh kosong!' })
  comment!: string;
}