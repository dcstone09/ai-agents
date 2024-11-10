import { Command, CommandRunner } from 'nest-commander';
import { BashAgent } from '../agents/bash.agent';

@Command({ name: 'bash' })
export class BashCommand extends CommandRunner {
  constructor(private readonly bashAgent: BashAgent) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    console.log('BashCommand');
    this.bashAgent.run(passedParam[0]);
  }
}
