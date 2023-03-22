import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Readable } from "stream";

export class CreateTranscribeDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @Type(() => Readable)
  audio: Readable;
}
