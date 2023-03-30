import { Injectable } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AI } from '../../shared/ai';
import { ChatCompletionResponseMessageRoleEnum } from 'openai';
import { StorageService } from 'src/shared/storage';

@Injectable()
export class CallsService {
  constructor(private prisma: PrismaService) {}

  async create(createCallDto: CreateCallDto) {
    const ai = new AI();
    const newCharacter = await ai.getCharacter(createCallDto.character);
    const newCallResponse = await ai.startCall(createCallDto.prompt, newCharacter);
    const responseAudio = await ai.textToSpeech(
      newCallResponse.response.content,
      StorageService.generateKeyFromString(newCallResponse.response.content),
    )
    const newCall = await this.prisma.call.create({
      data: {
        character: {
          create: {
            name: newCharacter.name,
            voiceName: newCharacter.voice,
            gender: newCharacter.gender,
            languageCode: newCharacter.languageCode,
          }
        },
        prompt: createCallDto.prompt,
        messages: {
          createMany: {
            data: [
              {
                text: newCallResponse.callPrompt,
                role: 'system',
              },
              {
                text: newCallResponse.response.content,
                role: newCallResponse.response.role as ChatCompletionResponseMessageRoleEnum,
              },
            ],
          },
        },
      },
    });
    return {
      ...newCall,
      response: {
        text: newCallResponse.response.content,
        audio: responseAudio,
        voice: newCharacter.voice
      },
    };
  }

  findAll() {
    return this.prisma.call.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} call`;
  }

  update(id: number, updateCallDto: UpdateCallDto) {
    return `This action updates a #${id} call`;
  }

  remove(id: number) {
    return `This action removes a #${id} call`;
  }
}
