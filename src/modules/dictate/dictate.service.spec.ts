import { Test, TestingModule } from '@nestjs/testing';
import { DictateService } from './dictate.service';

describe('DictateService', () => {
  let service: DictateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictateService],
    }).compile();

    service = module.get<DictateService>(DictateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
