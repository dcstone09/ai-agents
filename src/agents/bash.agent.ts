import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import { BetaMessageParam } from '@anthropic-ai/sdk/resources/beta/messages/messages';
import { Logger } from 'nestjs-pino';

@Injectable()
export class BashAgent {
  constructor(private readonly logger: Logger) {}
  async run(prompt: string): Promise<void> {
    const anthropic = new Anthropic();

    const messages: BetaMessageParam[] = [{ role: 'user', content: prompt }];

    while (true) {
      const response = await anthropic.beta.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        tools: [
          {
            type: 'bash_20241022',
            name: 'bash',
          },
        ],
        messages,
        betas: ['computer-use-2024-10-22'],
      });

      // Convert response to messages
      const response_content = [];
      response.content.forEach((content) => {
        if (content.type === 'text') {
          response_content.push({ type: 'text', text: content.text });
        } else {
          response_content.push(content);
        }
      });

      // Add assistant response to messages
      messages.push({
        role: 'assistant',
        content: response_content,
      });

      if (response.stop_reason !== 'tool_use') {
        // print out the last message
        console.log(response.content[0]['text']);
        break;
      }

      const results = [];
      response.content.forEach((content) => {
        if (content.type === 'tool_use' && content.name === 'bash') {
          let output = '';
          try {
            output = execSync(content.input['command'], {
              encoding: 'utf-8',
            });
          } catch (error) {
            this.logger.error(error);
          }

          results.push({
            tool_call_id: content.id,
            output: {
              type: 'tool_result',
              content: output,
              tool_use_id: content.id,
            },
          });
        }
      });

      messages.push({
        role: 'user',
        content: [results[0].output],
      });
    }
  }
}
