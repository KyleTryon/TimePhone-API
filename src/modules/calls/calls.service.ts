import { Injectable } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AI } from '../../shared/ai';

@Injectable()
export class CallsService {
  constructor(private prisma: PrismaService) {}

  async create(createCallDto: CreateCallDto) {
    const newCallPrompt = await new AI().startCall(createCallDto.prompt);
    return this.prisma.call.create({
      data: {
        character: createCallDto.character,
        createdAt: new Date(),
        prompt: newCallPrompt,
        },
      }
    );
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
