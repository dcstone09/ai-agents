import { Injectable } from '@nestjs/common';
import { BaseAgent } from './base.agent';
import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { FileOperationsTool } from '../tools/filesystem/file-operations.tool';
import { BashOperationsTool } from '../tools/bash/bash-operations.tool';

@Injectable()
export class ChatAgent extends BaseAgent {
  private readonly agent;

  constructor(
    private readonly fileOperationsTool: FileOperationsTool,
    private readonly bashOperationsTool: BashOperationsTool,
  ) {
    super();

    const model = new ChatAnthropic({
      modelName: 'claude-3-sonnet-20240229',
      temperature: 0,
    });

    this.agent = createReactAgent({
      llm: model,
      tools: [fileOperationsTool, bashOperationsTool],
    });
  }

  async process(input: string): Promise<string> {
    const inputs = {
      messages: [{ role: 'user', content: input }],
    };

    let finalResponse = '';
    const stream = await this.agent.stream(inputs, {
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
