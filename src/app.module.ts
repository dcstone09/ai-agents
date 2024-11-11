import { Module } from '@nestjs/common';
import { BashAgent } from './agents/bash.agent';
import { BashCommand } from './commands/bash.command';
import { LoggerModule } from 'nestjs-pino';
import { EditorAgent } from './agents/editor.agent';
import { EditorCommand } from './commands/editor.command';
import Anthropic from '@anthropic-ai/sdk';
import { pinoConfig } from './config/pino.config';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: pinoConfig,
    }),
  ],
  providers: [
    {
      provide: 'ANTHROPIC',
      useFactory: () => new Anthropic(),
    },
    BashAgent,
    BashCommand,
    EditorAgent,
    EditorCommand,
  ],
})
export class AppModule {}
