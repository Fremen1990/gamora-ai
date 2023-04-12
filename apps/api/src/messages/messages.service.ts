import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class MessagesService {

  constructor(private readonly prisma: PrismaService) {
  }

  async createMessage(message: string) {
    const exists = await this.checkIfMessageExists(message);
    if (exists) {
      return {
        ...exists,
        created: false
      }
    }

    const newMessage = await this.prisma.message.create({
      data: {
        message
      }
    });

    return {
      ...newMessage,
      created: true
    }
  }

  private async checkIfMessageExists(message) {
    return await this.prisma.message.findFirst({
      where: {
        message
      }
    })
  }

}
