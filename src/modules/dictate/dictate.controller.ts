import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DictateService } from './dictate.service';
import { CreateDictateDto } from './dto/create-dictate.dto';

@Controller('dictate')
@ApiTags('Dictate')
export class DictateController {
  constructor(private readonly dictateService: DictateService) {}

  @Post()
  @ApiBody({
    description: 'Dictate text and get the audio back as a file url.',
    type: CreateDictateDto,
  })
  @ApiOkResponse({
    description: 'Dictation created successfully.',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
      example: {
        url: 'https://example.com/audio.mp3',
      },
    },
  })
  create(@Body() createDictateDto: CreateDictateDto) {
    return this.dictateService.create(createDictateDto);
  }

  // @Get()
  // findAll() {
  //   return this.dictateService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dictateService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDictateDto: UpdateDictateDto) {
  //   return this.dictateService.update(+id, updateDictateDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dictateService.remove(+id);
  // }
}
