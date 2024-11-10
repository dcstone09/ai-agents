import { Module } from '@nestjs/common';
import { BashAgent } from './agents/bash.agent';
import { BashCommand } from './commands/bash.command';
import { LoggerModule } from 'nestjs-pino';
import { EditorAgent } from './agents/editor.agent';
import { EditorCommand } from './commands/editor.command';

@Module({
  imports: [LoggerModule.forRoot()],
  providers: [BashAgent, BashCommand, EditorAgent, EditorCommand],
})
export class AppModule {}
