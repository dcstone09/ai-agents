import { Module } from '@nestjs/common';
import { ToolsModule } from '../tools/tools.module';
import { ChatAgent } from './chat.agent';

@Module({
  imports: [ToolsModule],
  providers: [ChatAgent],
  exports: [ChatAgent],
})
export class AgentsModule {}
