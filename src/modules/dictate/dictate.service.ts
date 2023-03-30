import { Injectable } from '@nestjs/common';
import { AI } from '../../shared/ai';
import { CreateDictateDto } from './dto/create-dictate.dto';

const ai = new AI();
@Injectable()
export class DictateService {
  async create(createDictateDto: CreateDictateDto) {
    const key =
      createDictateDto.text
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(' ', 3)
        .join('_') +
      '_' +
      new Date().getTime();
    const response = {
      url: await ai.textToSpeech(createDictateDto.text, key),
    };
    return response;
  }

  // findAll() {
  //   return `This action returns all dictate`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} dictate`;
  // }

  // update(id: number, updateDictateDto: UpdateDictateDto) {
  //   return `This action updates a #${id} dictate`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} dictate`;
  // }
}
