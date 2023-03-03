import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  create(@Body() createCallDto: CreateCallDto) {
    return this.callsService.create(createCallDto);
  }

  @Get()
  findAll() {
    return this.callsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCallDto: UpdateCallDto) {
    return this.callsService.update(+id, updateCallDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.callsService.remove(+id);
  }
}
