import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CallsController],
  providers: [CallsService],
  imports: [PrismaModule],
})
export class CallsModule {}
