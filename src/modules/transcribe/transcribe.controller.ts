import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TranscribeService } from './transcribe.service';
import { CreateTranscribeDto } from './dto/create-transcribe.dto';
import { UpdateTranscribeDto } from './dto/update-transcribe.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('transcribe')
@ApiTags('Transcribe')
export class TranscribeController {
  constructor(private readonly transcribeService: TranscribeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Audio to transcribe. Must be in .mp3 format.',
    type: CreateTranscribeDto,
  })
  @ApiOkResponse({
    description: 'Transcription created successfully.',
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
      },
      example: {
        text: 'Hello, my name is John Doe.',
      },
    },
  })
  create(@UploadedFile() audio: Express.Multer.File) {
    return this.transcribeService.create(audio);
  }

  // @Get()
  // findAll() {
  //   return this.transcribeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.transcribeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTranscribeDto: UpdateTranscribeDto,
  // ) {
  //   return this.transcribeService.update(+id, updateTranscribeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transcribeService.remove(+id);
  // }
}
