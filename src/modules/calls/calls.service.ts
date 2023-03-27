import { Injectable } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AI } from '../../shared/ai';
import { ChatCompletionResponseMessageRoleEnum } from 'openai';

@Injectable()
export class CallsService {
  constructor(private prisma: PrismaService) {}

  async create(createCallDto: CreateCallDto) {
    const newCallResponse = await new AI().startCall(createCallDto.prompt);
    const newCall = await this.prisma.call.create({
      data: {
        character: createCallDto.character,
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
