import { Test, TestingModule } from '@nestjs/testing';
import { TranscribeController } from './transcribe.controller';
import { TranscribeService } from './transcribe.service';

describe('TranscribeController', () => {
  let controller: TranscribeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranscribeController],
      providers: [TranscribeService],
    }).compile();

    controller = module.get<TranscribeController>(TranscribeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
