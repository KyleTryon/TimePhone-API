import { Injectable } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AI } from '../../shared/ai';

@Injectable()
export class CallsService {
  constructor(private prisma: PrismaService) {}

  async create(createCallDto: CreateCallDto) {
    const newCall = await new AI().startCall(createCallDto.character);
    console.log(newCall);
    return this.prisma.call.create({
      data: {
        character: createCallDto.character,
        chatGPTId: newCall.id,
        createdAt: new Date(),
        messages: {
          create: [
            {
              audioUrl: '',
              body: newCall.choices[0].message.content,
              createdAt: new Date(),
              isBot: true,
            },
          ],
        },
      },
    });
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
