import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AI } from 'src/shared/ai';
import { StorageService } from 'src/shared/storage';

const ai = new AI();

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(audioUpload: Express.Multer.File, createMessageDto: CreateMessageDto) {

    const audioKey = () => {
      const date = new Date();
      return `${createMessageDto.callId}-${date.getTime()}.mp3`
    }

    const audioFile = StorageService.convertMulerToFile(audioUpload);

    const transcribedMessage = await ai.transcribeAudioMessage(audioFile);
    const savedAudio = await new StorageService().uploadFile(
      audioKey(),
      audioFile,
    );
    
    return this.prisma.message.create({
      data: {
        call: {
          connect: {
            id: createMessageDto.callId,
          },
        },
        body: transcribedMessage.data.text,
        createdAt: new Date(),
        audioUrl: StorageService.getFileUrl(audioKey()),
        isBot: false,
      },
    });
  }

  findAll() {
    return this.prisma.message.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
