import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ChatAgent } from '../../agents/chat.agent';

@Injectable()
@Command({
  name: 'chat',
  description: 'Start a chat session with the AI assistant',
})
export class ChatCommand extends CommandRunner {
  constructor(private readonly chatAgent: ChatAgent) {
    super();
  }

  async run(): Promise<void> {
    console.log('Starting chat session... (type "exit" to quit)');

    while (true) {
      const input = await this.prompt();
      if (input.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        break;
      }

      const response = await this.chatAgent.process(input);
      console.log('\nAI:', response, '\n');
    }
  }

  private async prompt(): Promise<string> {
    return new Promise((resolve) => {
      process.stdout.write('You: ');
      process.stdin.once('data', (data) => {
        resolve(data.toString().trim());
      });
    });
  }
}
