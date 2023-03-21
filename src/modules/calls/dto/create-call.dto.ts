import { ApiProperty } from '@nestjs/swagger';
export class CreateCallDto {
  @ApiProperty({ example: 'Galileo Galilei' })
  character: string;
  @ApiProperty({
    example: 'You will pretend to be Galileo Galilei. Introduce yourself.',
  })
  prompt: string;
}
