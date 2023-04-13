import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { OpenaiService } from './openai/openai.service';
import { PineconeService } from './pinecone/pinecone.service';

describe('MessagesController', () => {
  let controller: MessagesController;
  let messagesService: MessagesService;
  let openaiService: OpenaiService;
  let pineconeService: PineconeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: {
            createMessage: jest.fn(),
            getContext: jest.fn(),
          },
        },
        {
          provide: OpenaiService,
          useValue: {
            createEmbedding: jest.fn(),
            createCompletion: jest.fn(),
          },
        },
        {
          provide: PineconeService,
          useValue: {
            query: jest.fn(),
            upsert: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    messagesService = module.get<MessagesService>(MessagesService);
    openaiService = module.get<OpenaiService>(OpenaiService);
    pineconeService = module.get<PineconeService>(PineconeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createMessage', () => {
    const testMessage = { message: 'test message' };
    const testEmbedding = { data: [{ embedding: 'testEmbedding' }] };
    const testMatches = ['match1', 'match2'];
    const testContext = 'test context';

    beforeEach(() => {
      jest.spyOn(messagesService, 'createMessage').mockResolvedValue({
        id: 1,
        created: true,
        message: testMessage.message,
      });
      jest
        .spyOn(openaiService, 'createEmbedding')
        .mockResolvedValue(testEmbedding);
      jest.spyOn(pineconeService, 'query').mockResolvedValue(testMatches);
      jest.spyOn(messagesService, 'getContext').mockResolvedValue(testContext);
    });

    it('should call services with the correct parameters', async () => {
      await controller.createMessage(testMessage);

      expect(messagesService.createMessage).toHaveBeenCalledWith(
        testMessage.message
      );
      expect(openaiService.createEmbedding).toHaveBeenCalledWith(
        testMessage.message
      );
      expect(pineconeService.query).toHaveBeenCalledWith(
        testEmbedding.data[0].embedding
      );
      expect(messagesService.getContext).toHaveBeenCalledWith(testMatches);
    });

    it('should call pineconeService.upsert if message is created', async () => {
      await controller.createMessage(testMessage);

      expect(pineconeService.upsert).toHaveBeenCalledWith({
        id: '1',
        values: testEmbedding.data[0].embedding,
      });
    });

    it('should not call pineconeService.upsert if message is not created', async () => {
      jest.spyOn(messagesService, 'createMessage').mockResolvedValue({
        id: 1,
        created: false,
        message: testMessage.message,
      });
    });
  });
});
