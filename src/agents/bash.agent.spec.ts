import { createMock } from '@golevelup/ts-jest';
import { BashAgent } from './bash.agent';
import { Test } from '@nestjs/testing';
import { getLoggerToken, PinoLogger } from 'nestjs-pino';
import Anthropic from '@anthropic-ai/sdk';

describe('BashAgent', () => {
  let bashAgent: BashAgent;
  let anthropic: jest.Mocked<Anthropic>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BashAgent,
        {
          provide: getLoggerToken(BashAgent.name),
          useValue: createMock<PinoLogger>(),
        },
        {
          provide: 'ANTHROPIC',
          useValue: createMock<Anthropic>({
            beta: {
              messages: {
                create: jest.fn(),
              },
            },
          }),
        },
      ],
    }).compile();

    bashAgent = moduleRef.get<BashAgent>(BashAgent);
    anthropic = moduleRef.get('ANTHROPIC');
  });

  it('should execute bash commands based on AI response', async () => {
    const mockResponses = [
      {
        content: [
          {
            type: 'tool_use',
            name: 'bash',
            id: 'test-id',
            input: {
              command: 'echo "hello"',
            },
          },
        ],
        stop_reason: 'tool_use',
      },
      {
        content: [
          {
            type: 'tool_use',
            name: 'bash',
            id: 'test-id',
            input: {
              command: 'echo "hello"',
            },
          },
        ],
        stop_reason: 'end_turn',
      },
    ];

    (anthropic.beta.messages.create as jest.Mock)
      .mockResolvedValueOnce(mockResponses[0])
      .mockResolvedValueOnce(mockResponses[1]);

    // Add your test assertions here
    await bashAgent.run('test prompt');

    expect(anthropic.beta.messages.create).toHaveBeenCalledTimes(2);
  });
});
