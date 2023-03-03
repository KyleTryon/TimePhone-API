import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';

describe('CallsController', () => {
  let controller: CallsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallsController],
      providers: [CallsService, PrismaService],
    }).compile();

    controller = module.get<CallsController>(CallsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
