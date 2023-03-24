import { ApiProperty } from "@nestjs/swagger";

export class CreateDictateDto {
  @ApiProperty({ example: 'Hello, my name is Galileo Galilei.' })
  text: string;
}
