import { PartialType } from '@nestjs/swagger';
import { CreateCallDto } from './create-call.dto';

export class UpdateCallDto extends PartialType(CreateCallDto) {}
