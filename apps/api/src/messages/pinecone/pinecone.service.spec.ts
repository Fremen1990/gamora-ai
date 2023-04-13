import { PineconeService } from './pinecone.service';
import { PineconeClient } from 'pinecone-client';

interface PineconeVectors {
  [key: string]: number[];
}

describe('PineconeService', () => {
  let pineconeService: PineconeService;
  let pineconeClient: PineconeClient<PineconeVectors>;

  beforeAll(() => {
    process.env.PINECONE_API_KEY = 'mock_api_key';
    process.env.PINECONE_BASE_URL = 'http://localhost:8080';
    process.env.PINECONE_NAMESPACE = 'mock_namespace';
  });

  beforeEach(() => {
    pineconeClient = {
      upsert: jest.fn(),
      query: jest.fn(),
    } as unknown as PineconeClient<PineconeVectors>;
    pineconeService = new PineconeService();
    pineconeService['pinecone'] = pineconeClient;
  });

  afterAll(() => {
    jest.resetAllMocks();
    delete process.env.PINECONE_API_KEY;
    delete process.env.PINECONE_BASE_URL;
    delete process.env.PINECONE_NAMESPACE;
  });

  describe('upsert', () => {
    it('should call pinecone.upsert with vectors', () => {
      const vectors = [1, 2, 3];
      const pineconeVectors: PineconeVectors = { '0': vectors };
      pineconeService.upsert(vectors);
      expect(pineconeClient.upsert).toHaveBeenCalledWith({
        vectors: [vectors],
      });
    });
  });

  describe('query', () => {
    it('should call pinecone.query with vector and options', async () => {
      const vector = [1, 2, 3];
      const matches = [{ id: '1', score: 0.9 }];
      (pineconeClient.query as jest.Mock).mockResolvedValue({ matches });
      const expectedMatches = [1];
      const actualMatches = await pineconeService.query(vector);
      expect(pineconeClient.query).toHaveBeenCalledWith({
        vector: vector,
        topK: 10,
        includeMetadata: true,
        includeValues: false,
      });
      expect(actualMatches).toEqual(expectedMatches);
    });
  });
});
