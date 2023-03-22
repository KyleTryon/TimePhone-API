import { PartialType } from '@nestjs/swagger';
import { CreateTranscribeDto } from './create-transcribe.dto';

export class UpdateTranscribeDto extends PartialType(CreateTranscribeDto) {}
