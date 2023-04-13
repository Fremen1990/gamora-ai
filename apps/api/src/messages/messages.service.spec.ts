import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MessagesService', () => {
  let service: MessagesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: PrismaService,
          useValue: {
            message: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMessage', () => {
    const testMessage = 'test message';
    const existingMessage = { id: 1, message: testMessage };
    const createdMessage = { id: 2, message: testMessage };

    it('should return existing message with created set to false', async () => {
      jest
        .spyOn(prismaService.message, 'findFirst')
        .mockResolvedValue(existingMessage);

      const result = await service.createMessage(testMessage);

      expect(result).toEqual({ ...existingMessage, created: false });
    });

    it('should create and return new message with created set to true', async () => {
      jest.spyOn(prismaService.message, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prismaService.message, 'create')
        .mockResolvedValue(createdMessage);

      const result = await service.createMessage(testMessage);

      expect(result).toEqual({ ...createdMessage, created: true });
      expect(prismaService.message.create).toHaveBeenCalledWith({
        data: { message: testMessage },
      });
    });
  });

  describe('messages', () => {
    const testIds = [1, 2, 3];
    const testMessages = [
      { id: 1, message: 'message 1' },
      { id: 2, message: 'message 2' },
      { id: 3, message: 'message 3' },
    ];

    it('should return messages for given ids', async () => {
      jest
        .spyOn(prismaService.message, 'findMany')
        .mockResolvedValue(testMessages);

      const result = await service.messages(testIds);

      expect(result).toEqual(testMessages);
      expect(prismaService.message.findMany).toHaveBeenCalledWith({
        where: { id: { in: testIds } },
      });
    });
  });

  describe('getContext', () => {
    const matches = [1, 2];
    const testMessages = [
      { id: 1, message: 'message 1' },
      { id: 2, message: 'message 2' },
    ];
    const expectedResult = 'message 1\nmessage 2\n';

    beforeEach(() => {
      jest.spyOn(service, 'messages').mockResolvedValue(testMessages);
    });

    it('should return context from matches', async () => {
      const result = await service.getContext(matches);

      expect(result).toEqual(expectedResult);
      expect(service.messages).toHaveBeenCalledWith(matches);
    });
  });
});
