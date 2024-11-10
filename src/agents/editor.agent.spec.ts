import { createMock } from '@golevelup/ts-jest';
import { EditorAgent } from './editor.agent';
import { Test } from '@nestjs/testing';
import { getLoggerToken, PinoLogger } from 'nestjs-pino';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
const mockedFs = fs as jest.Mocked<typeof fs>;

jest.mock('fs');

describe('EditorAgent', () => {
  let editorAgent: EditorAgent;
  let anthropic: jest.Mocked<Anthropic>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        EditorAgent,
        {
          provide: getLoggerToken(EditorAgent.name),
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

    editorAgent = moduleRef.get<EditorAgent>(EditorAgent);
    anthropic = moduleRef.get('ANTHROPIC');
  });

  it('should handle view command', async () => {
    const mockFileContent = 'test file content';
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(mockFileContent);

    const mockResponse = {
      content: [
        {
          type: 'tool_use',
          name: 'str_replace_editor',
          id: 'test-id',
          input: {
            command: 'view',
            path: '/test/file.txt',
          },
        },
      ],
      stop_reason: 'end_turn',
    };

    (anthropic.beta.messages.create as jest.Mock).mockResolvedValue(
      mockResponse,
    );

    await editorAgent.run('view file content');

    expect(anthropic.beta.messages.create).toHaveBeenCalled();
  });

  it('should handle create command', async () => {
    const mockFileContent = 'new file content';
    mockedFs.writeFileSync.mockImplementation(() => {});

    const mockResponse = {
      content: [
        {
          type: 'tool_use',
          name: 'str_replace_editor',
          id: 'test-id',
          input: {
            command: 'create',
            path: '/test/file.txt',
            file_text: mockFileContent,
          },
        },
      ],
      stop_reason: 'end_turn',
    };

    (anthropic.beta.messages.create as jest.Mock).mockResolvedValue(
      mockResponse,
    );

    await editorAgent.run('create new file');

    expect(anthropic.beta.messages.create).toHaveBeenCalled();
  });

  it('should handle str_replace command', async () => {
    const mockFileContent = 'old content';
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(mockFileContent);
    mockedFs.writeFileSync.mockImplementation(() => {});

    const mockResponse = {
      content: [
        {
          type: 'tool_use',
          name: 'str_replace_editor',
          id: 'test-id',
          input: {
            command: 'str_replace',
            path: '/test/file.txt',
            old_str: 'old',
            new_str: 'new',
          },
        },
      ],
      stop_reason: 'end_turn',
    };

    (anthropic.beta.messages.create as jest.Mock).mockResolvedValue(
      mockResponse,
    );

    await editorAgent.run('replace text');

    expect(anthropic.beta.messages.create).toHaveBeenCalled();
  });

  it('should handle insert command', async () => {
    const mockFileContent = 'line 1\nline 2';

    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(mockFileContent);
    mockedFs.writeFileSync.mockImplementation(() => {});

    const mockResponse = {
      content: [
        {
          type: 'tool_use',
          name: 'str_replace_editor',
          id: 'test-id',
          input: {
            command: 'insert',
            path: '/test/file.txt',
            insert_line: 1,
            new_str: 'new line',
          },
        },
      ],
      stop_reason: 'end_turn',
    };

    (anthropic.beta.messages.create as jest.Mock).mockResolvedValue(
      mockResponse,
    );

    await editorAgent.run('insert line');

    expect(anthropic.beta.messages.create).toHaveBeenCalled();
  });
});
