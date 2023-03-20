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
    const messageAudioKey = StorageService.generateKey(audio.originalname);
    // Validate audio file
    if (audio.size < 200) {
      throw new Error('Audio file is too small or missing');
    }
    if (audio.mimetype !== 'audio/mpeg') {
      throw new Error('Audio file must be mp3');
    }
    // Save messageAudio file
    const messageAudioUpload = await storage.uploadFile(messageAudioKey, audio);
    if (!messageAudioUpload.httpStatusCode || messageAudioUpload.httpStatusCode !== 200) {
      throw new Error('Error saving audio file');
    }
    // Transcribe audio file
    const messageAudioTranscribed = await ai.transcribeAudioMessage(audio);
    // Validate transcription
    if (!messageAudioTranscribed.text) {
      throw new Error('Error transcribing audio file');
    }
    // Create response
    const call = await this.prisma.call.findUnique({
      where: {
        id: parseInt(createMessageDto.callId as any),
      },
      include: {
        messages: true,
      },
    });
    const responseText = await ai.continueCall(call, messageAudioTranscribed.text);
    // Save response
    return this.prisma.message.create({
      data: {
        call: {
          connect: {
            id: parseInt(createMessageDto.callId as any),
          },
        },
        messageAudioUrl: StorageService.getFileUrl(messageAudioKey),
        messageText: messageAudioTranscribed.text,
        responseAudioUrl: '',
        responseText,
        createdAt: new Date(),
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
