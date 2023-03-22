import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CallsModule } from './modules/calls/calls.module';
import { MessagesModule } from './modules/messages/messages.module';
import { TranscribeModule } from './modules/transcribe/transcribe.module';

@Module({
  imports: [PrismaModule, CallsModule, MessagesModule, TranscribeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
