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

  /**
   * Create a new user message from an audio file, for an existing call
   * @param createMessageDto
   * @param audio
   */
  async create(createMessageDto: CreateMessageDto, audio: Express.Multer.File) {
    // Validate audio file
    if (!audio) {
      throw new Error('Audio file is missing');
    } else if (audio.size < 200) {
      throw new Error('Audio file is too small');
    } else if (audio.mimetype !== 'audio/mpeg') {
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
        messages: {
          orderBy: {
            id: 'desc',
          },
        },
      },
    });
    // Wait for all promises to resolve
    const [messageAudioTranscribed, call] = await Promise.all([
      messageAudioTranscribedPromise,
      callPromise,
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
    const responseAudioKey = StorageService.generateKeyFromString(
      responseText.choices[0].message.content,
    );
    // Dictate response
    const responseAudio = await ai.textToSpeech(
      responseText.choices[0].message.content,
      responseAudioKey,
    );
    // Add user message and response message to call
    const messages = await this.prisma.message.createMany({
      data: [
        {
          callId: parseInt(createMessageDto.callId as any),
          text: messageAudioTranscribed.text,
        },
        {
          callId: parseInt(createMessageDto.callId as any),
          text: responseText.choices[0].message.content,
          role: 'assistant',
        },
      ],
    });
    return {
      callId: parseInt(createMessageDto.callId as any),
      request: {
        text: messageAudioTranscribed.text,
      },
      response: {
        text: responseText.choices[0].message.content,
        audio: responseAudio,
      },
    };
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
