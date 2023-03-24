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
    const messageAudioKey = StorageService.generateKey(audio.originalname);
    // Validate audio file
    if (!audio) {
      throw new Error('Audio file is missing');
    }
    if (audio.size < 200) {
      throw new Error('Audio file is too small');
    }
    if (audio.mimetype !== 'audio/mpeg') {
      throw new Error('Audio file must be mp3');
    }
    // Transcribe audio file
    const messageAudioTranscribedPromise = ai.transcribeAudioMessage(audio);
    // Get call
    const callPromise = this.prisma.call.findUnique({
      where: {
        id: parseInt(createMessageDto.callId as any),
      },
      include: {
        messages: true,
      },
    });
    // Wait for all promises to resolve
    const [messageAudioTranscribed, call] =
      await Promise.all([
        messageAudioTranscribedPromise,
        callPromise
      ]);
    // Validate transcription
    if (!messageAudioTranscribed.text) {
      throw new Error('Error transcribing audio file');
    }
    // Create response
    const responseText = await ai.continueCall(
      call,
      messageAudioTranscribed.text,
    );
    // Save response
    return this.prisma.message
      .create({
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
      })
      .then((message) => {
        return {
          ...message,
          character: call.character,
        };
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
