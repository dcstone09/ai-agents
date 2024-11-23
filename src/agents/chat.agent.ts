import { Injectable } from '@nestjs/common';
import { BaseAgent } from './base.agent';
import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { BashOperationsTool } from '../tools/bash/bash-operations.tool';
import { MemorySaver } from '@langchain/langgraph';
import { TimeOperationsTool } from '../tools/time/time-operations.tool';
import { AppendFileTool } from 'src/tools/filesystem/append-file.tool';
import { DeleteFileTool } from 'src/tools/filesystem/delete-file.tool';
import { FileExistsTool } from 'src/tools/filesystem/file-exists.tool';
import { ReadFileTool } from 'src/tools/filesystem/read-file.tool';
import { WriteFileTool } from 'src/tools/filesystem/write-file.tool';
import { AddMemoryTool } from 'src/tools/memory/add-memory.tool';
import { DeleteMemoryTool } from 'src/tools/memory/delete-memory.tool';
import { GetMemoryTool } from 'src/tools/memory/get-memory.tool';
import { ListMemoryTool } from 'src/tools/memory/list-memory.tool';
import { WebFetchTool } from 'src/tools/web/web-fetch.tool';

@Injectable()
export class ChatAgent extends BaseAgent {
  private readonly agent;
  private readonly checkpointer = new MemorySaver();

  constructor(
    private readonly readFileTool: ReadFileTool,
    private readonly writeFileTool: WriteFileTool,
    private readonly appendFileTool: AppendFileTool,
    private readonly deleteFileTool: DeleteFileTool,
    private readonly fileExistsTool: FileExistsTool,
    private readonly bashOperationsTool: BashOperationsTool,
    private readonly timeOperationsTool: TimeOperationsTool,
    private readonly addMemoryTool: AddMemoryTool,
    private readonly getMemoryTool: GetMemoryTool,
    private readonly deleteMemoryTool: DeleteMemoryTool,
    private readonly listMemoryTool: ListMemoryTool,
    private readonly webFetchTool: WebFetchTool,
  ) {
    super();

    const model = new ChatAnthropic({
      modelName: 'claude-3-5-sonnet-20241022',
      temperature: 0,
    });

    this.agent = createReactAgent({
      llm: model,
      tools: [
        this.readFileTool,
        this.writeFileTool,
        this.appendFileTool,
        this.deleteFileTool,
        this.fileExistsTool,
        this.bashOperationsTool,
        this.timeOperationsTool,
        this.addMemoryTool,
        this.getMemoryTool,
        this.deleteMemoryTool,
        this.listMemoryTool,
        this.webFetchTool,
      ],
      checkpointSaver: this.checkpointer,
    });
  }

  async process(input: string): Promise<string> {
    const inputs = {
      messages: [{ role: 'user', content: input }],
    };

    // Generate a unique thread ID for this conversation if not provided
    const config = {
      configurable: {
        thread_id: 'default-thread',
      },
    };

    let finalResponse = '';
    const stream = await this.agent.stream(inputs, {
      ...config,
      streamMode: 'values',
    });

    for await (const { messages } of stream) {
      const msg = messages[messages?.length - 1];
      if (msg?.content) {
        finalResponse = msg.content;
      }
    }

    return finalResponse;
  }
}
