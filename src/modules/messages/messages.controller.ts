import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
// import { UpdateMessageDto } from './dto/update-message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('messages')
@ApiTags('Conversations')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // The create function is used to create a new message. It must contain an audio file, callID.
  @Post()
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new message in a call and get a response.',
    type: CreateMessageDto,
  })
  @ApiOkResponse({
    description: 'Message created successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        character: { type: 'string' },
        createdAt: { type: 'string' },
        prompt: { type: 'string' },
        responseText: { type: 'string' },
      },
      example: {
        id: 1,
        character: 'Galileo Galilei',
        createdAt: '2023-03-01T00:00:00.000Z',
        prompt:
          'You must pretend to be Galileo Galilei, you know their life history and will speak in their style. Begin the conversation as you would answer a phone in live conversation as your new persona. \nYOU: "Good day, this is Galileo Galilei speaking. To whom do I have the privilege of speaking',
        responseText:
          'Good day, this is Galileo Galilei speaking. To whom do I have the privilege of speaking',
      },
    },
  })
  create(
    @Body() createMessageDto: CreateMessageDto,
    @UploadedFile() audio: Express.Multer.File,
  ) {
    return this.messagesService.create(createMessageDto, audio);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(+id, updateMessageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.messagesService.remove(+id);
  // }
}
