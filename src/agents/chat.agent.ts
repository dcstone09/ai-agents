import { Injectable } from '@nestjs/common';
import { BaseAgent } from './base.agent';
import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { FileOperationsTool } from '../tools/filesystem/file-operations.tool';
import { BashOperationsTool } from '../tools/bash/bash-operations.tool';
import { MemorySaver } from '@langchain/langgraph';
import { TimeOperationsTool } from '../tools/time/time-operations.tool';
@Injectable()
export class ChatAgent extends BaseAgent {
  private readonly agent;
  private readonly checkpointer = new MemorySaver();

  constructor(
    private readonly fileOperationsTool: FileOperationsTool,
    private readonly bashOperationsTool: BashOperationsTool,
    private readonly timeOperationsTool: TimeOperationsTool,
  ) {
    super();

    const model = new ChatAnthropic({
      modelName: 'claude-3-sonnet-20240229',
      temperature: 0,
    });

    this.agent = createReactAgent({
      llm: model,
      tools: [
        this.fileOperationsTool,
        this.bashOperationsTool,
        this.timeOperationsTool,
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
