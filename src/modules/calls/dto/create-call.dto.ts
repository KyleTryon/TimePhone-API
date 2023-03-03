import { ApiProperty } from '@nestjs/swagger';
export class CreateCallDto {
  @ApiProperty({ example: 'Galileo Galilei' })
  character: string;
}
