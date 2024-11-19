import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { BashTool } from './tools/bash.tool';
import { FileTool } from './tools/file.tool';
import { AssistantAgent } from './agents/assistant.agent';

@Module({
  imports: [LoggerModule.forRoot()],
  providers: [BashTool, FileTool, AssistantAgent],
  exports: [BashTool, FileTool, AssistantAgent],
})
export class AppModule {}
