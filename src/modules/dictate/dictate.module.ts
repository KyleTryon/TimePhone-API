import { Module } from '@nestjs/common';
import { DictateService } from './dictate.service';
import { DictateController } from './dictate.controller';

@Module({
  controllers: [DictateController],
  providers: [DictateService]
})
export class DictateModule {}
