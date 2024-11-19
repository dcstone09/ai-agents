import { Test, TestingModule } from '@nestjs/testing';
import { AssistantAgent } from './assistant.agent';
import { getLoggerToken } from 'nestjs-pino';

describe('AssistantAgent', () => {
  let agent: AssistantAgent;
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantAgent,
        {
          provide: getLoggerToken(AssistantAgent.name),
          useValue: mockLogger,
        },
      ],
    }).compile();

    agent = module.get<AssistantAgent>(AssistantAgent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processMessage', () => {
    it('should process a message and return a response', async () => {
      const message = 'Hello, how are you?';
      const response = await agent.processMessage(message);

      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(mockLogger.info).toHaveBeenCalledTimes(2);
    });

    it('should handle errors gracefully', async () => {
      // Mock the app.invoke to throw an error
      jest
        .spyOn(agent['app'], 'invoke')
        .mockRejectedValue(new Error('Test error'));

      const message = 'Hello';
      await expect(agent.processMessage(message)).rejects.toThrow(
        'Failed to process message',
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
