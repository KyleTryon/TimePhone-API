import { Module } from '@nestjs/common';
import { TranscribeService } from './transcribe.service';
import { TranscribeController } from './transcribe.controller';

@Module({
  controllers: [TranscribeController],
  providers: [TranscribeService]
})
export class TranscribeModule {}
