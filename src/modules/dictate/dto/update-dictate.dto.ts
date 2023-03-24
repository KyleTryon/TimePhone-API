import { PartialType } from '@nestjs/swagger';
import { CreateDictateDto } from './create-dictate.dto';

export class UpdateDictateDto extends PartialType(CreateDictateDto) {}
