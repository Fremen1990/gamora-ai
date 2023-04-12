import {Body, Controller, Post} from '@nestjs/common';
import {MessagesService} from "./messages.service";
import {OpenaiService} from "./openai/openai.service";
import {PineconeService} from "./pinecone/pinecone.service";

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly openaiService: OpenaiService,
    private readonly pineconeService: PineconeService
  ) {
  }

  @Post()
  async createMessage(@Body() data: { message: string }) {
    const {id, created} = await this.messagesService.createMessage(data.message);

    return this.openaiService.createCompletion(data.message, "")
  }
}
