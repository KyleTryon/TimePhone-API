import { Test, TestingModule } from '@nestjs/testing';
import { DictateController } from './dictate.controller';
import { DictateService } from './dictate.service';

describe('DictateController', () => {
  let controller: DictateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictateController],
      providers: [DictateService],
    }).compile();

    controller = module.get<DictateController>(DictateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
