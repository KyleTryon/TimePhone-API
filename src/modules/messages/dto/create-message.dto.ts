import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Readable } from 'stream';

export class CreateMessageDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  callId: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  @Type(() => Readable)
  audioFile: Readable;
}
