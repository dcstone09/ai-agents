import { Command, CommandRunner } from 'nest-commander';
import { EditorAgent } from '../agents/editor.agent';

@Command({ name: 'editor' })
export class EditorCommand extends CommandRunner {
  constructor(private readonly editorAgent: EditorAgent) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    this.editorAgent.run(passedParam[0]);
  }
}
