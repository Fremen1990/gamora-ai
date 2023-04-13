import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MessagesService } from '../messages/messages.service';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [PrismaModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService, MessagesService],
})
export class AppModule {}
