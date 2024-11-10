import { Test, TestingModule } from '@nestjs/testing';
import { EditorAgent } from './editor.agent';
import { getLoggerToken } from 'nestjs-pino';

describe('EditorAgent', () => {
  let agent: EditorAgent;
  let mockLogger: any;

  beforeEach(async () => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditorAgent,
        {
          provide: getLoggerToken(EditorAgent.name),
          useValue: mockLogger,
        },
      ],
    }).compile();

    agent = module.get<EditorAgent>(EditorAgent);
  });

  it('should be defined', () => {
    expect(agent).toBeDefined();
  });

  describe('run', () => {
    it('should process the prompt', async () => {
      const prompt = 'test prompt';
      await agent.run(prompt);
      // Add assertions based on what run() should do
    });
  });
});
