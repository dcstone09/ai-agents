import Anthropic from '@anthropic-ai/sdk';
import { BetaMessageParam } from '@anthropic-ai/sdk/resources/beta/messages/messages';
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import fs from 'fs';

@Injectable()
export class EditorAgent {
  constructor(
    @InjectPinoLogger(EditorAgent.name)
    private readonly logger: PinoLogger,
  ) {}

  private getPath(path: string) {
    let clean_path = path.replace('/repo/', '');
    clean_path = process.cwd() + '/' + clean_path;
    return clean_path;
  }

  private handleView(path: string) {
    const filePath = this.getPath(path);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
    return null;
  }

  private handleCreate(
    path: string,
    input: { path: string; file_text: string },
  ) {
    const filePath = this.getPath(path);
    fs.writeFileSync(filePath, input.file_text);
    return input.file_text;
  }

  private handleInsert(
    path: string,
    input: {
      command: string;
      path: string;
      insert_line: number;
      new_str: string;
    },
  ) {
    const filePath = this.getPath(path);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const lines = fileContent.split('\n');
      lines.splice(input.insert_line, 0, input.new_str);
      const newContent = lines.join('\n');
      fs.writeFileSync(filePath, newContent);
      return newContent;
    }
    return null;
  }

  private handleReplace(
    path: string,
    input: { command: string; path: string; old_str: string; new_str: string },
  ) {
    const filePath = this.getPath(path);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const newContent = fileContent.replace(input.old_str, input.new_str);
      fs.writeFileSync(filePath, newContent);
      return newContent;
    }
    return null;
  }

  async run(prompt: string): Promise<void> {
    const anthropic = new Anthropic();

    const handlers = {
      view: this.handleView.bind(this),
      create: this.handleCreate.bind(this),
      str_replace: this.handleReplace.bind(this),
      insert: this.handleInsert.bind(this),
    };

    const messages: BetaMessageParam[] = [{ role: 'user', content: prompt }];

    while (true) {
      const response = await anthropic.beta.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        tools: [
          {
            type: 'text_editor_20241022',
            name: 'str_replace_editor',
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
        if (
          content.type === 'tool_use' &&
          content.name === 'str_replace_editor'
        ) {
          const command = content.input['command'] as string;
          const path = content.input['path'] as string;

          const result = handlers[command](path, content.input);

          results.push({
            tool_call_id: content.id,
            output: {
              type: 'tool_result',
              content: result,
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
