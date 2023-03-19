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

  async create(createMessageDto: CreateMessageDto, audio: Express.Multer.File) {
    const storage = new StorageService();
    const generateKey = () => {
      const date = new Date();
      return `${createMessageDto.callId}-${date.getTime()}.mp3`;
    };
    const audioKey = generateKey();

    if (audio.size < 200) {
      throw new Error('Audio file is too small or missing');
    }
    if (audio.mimetype !== 'audio/mpeg') {
      throw new Error('Audio file must be mp3');
    }

    const savedAudio = await storage.uploadFile(audioKey, audio);
    if (!savedAudio.httpStatusCode || savedAudio.httpStatusCode !== 200) {
      throw new Error('Error saving audio file');
    }
    const transcribedMessage = await ai.transcribeAudioMessage(audio);

    return this.prisma.message.create({
      data: {
        call: {
          connect: {
            id: parseInt(createMessageDto.callId as any),
          },
        },
        body: transcribedMessage.text,
        createdAt: new Date(),
        audioUrl: StorageService.getFileUrl(audioKey),
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
