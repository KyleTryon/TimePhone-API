import { Injectable } from '@nestjs/common';
import { CreateTranscribeDto } from './dto/create-transcribe.dto';
import { UpdateTranscribeDto } from './dto/update-transcribe.dto';
import { AI } from 'src/shared/ai';

const ai = new AI();
@Injectable()
export class TranscribeService {
  async create(audio: Express.Multer.File) {
    if (!audio) {
      throw new Error('Audio file is missing');
    }
    if (audio.size < 200) {
      throw new Error('Audio file is too small or missing');
    }
    if (audio.mimetype !== 'audio/mpeg') {
      throw new Error('Audio file must be mp3');
    }
    const messageAudioTranscribedPromise = ai.transcribeAudioMessage(audio);
    return (await messageAudioTranscribedPromise).text;
  }

  findAll() {
    return `This action returns all transcribe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transcribe`;
  }

  update(id: number, updateTranscribeDto: UpdateTranscribeDto) {
    return `This action updates a #${id} transcribe`;
  }

  remove(id: number) {
    return `This action removes a #${id} transcribe`;
  }
}
