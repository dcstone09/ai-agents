import { Test, TestingModule } from '@nestjs/testing';
import { BashAgent } from './bash.agent';
import { getLoggerToken } from 'nestjs-pino';
import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';

// Mock the external dependencies
jest.mock('child_process');

describe('BashAgent', () => {
  let bashAgent: BashAgent;
  // let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BashAgent,
        {
          provide: getLoggerToken(BashAgent.name),
          useValue: console,
        },
      ],
    }).compile();

    bashAgent = module.get<BashAgent>(BashAgent);
    // logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(bashAgent).toBeDefined();
  });

  it('should handle a simple bash command request', async () => {
    // Mock Anthropic response
    const mockResponse = {
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
    };

    // Mock the subsequent response after command execution
    const mockFinalResponse = {
      content: [
        {
          type: 'text',
          text: 'Command executed successfully',
        },
      ],
      stop_reason: 'end_turn',
    };

    // Setup mocks
    (Anthropic as jest.MockedClass<typeof Anthropic>).prototype.beta = {
      messages: {
        create: jest
          .fn()
          .mockResolvedValueOnce(mockResponse)
          .mockResolvedValueOnce(mockFinalResponse),
      },
    } as any;

    (execSync as jest.MockedFunction<typeof execSync>).mockReturnValue('hello');

    // Execute the test
    await bashAgent.run('Execute a simple command');

    // Verify the execSync was called with the correct command
    expect(execSync).toHaveBeenCalledWith('echo "hello"', {
      encoding: 'utf-8',
    });
  });

  it('should handle command execution errors', async () => {
    // Mock Anthropic response
    const mockResponse = {
      content: [
        {
          type: 'tool_use',
          name: 'bash',
          id: 'test-id',
          input: {
            command: 'invalid-command',
          },
        },
      ],
      stop_reason: 'tool_use',
    };

    // Mock the subsequent response after command execution
    const mockFinalResponse = {
      content: [
        {
          type: 'text',
          text: 'Command failed',
        },
      ],
      stop_reason: 'end_turn',
    };

    // Setup mocks
    (Anthropic as jest.MockedClass<typeof Anthropic>).prototype.beta = {
      messages: {
        create: jest
          .fn()
          .mockResolvedValueOnce(mockResponse)
          .mockResolvedValueOnce(mockFinalResponse),
      },
    } as any;

    (execSync as jest.MockedFunction<typeof execSync>).mockImplementation(
      () => {
        throw new Error('Command not found');
      },
    );

    // Execute the test
    await bashAgent.run('Execute an invalid command');

    // Verify the execSync was called with the invalid command
    expect(execSync).toHaveBeenCalledWith('invalid-command', {
      encoding: 'utf-8',
    });
  });
});
