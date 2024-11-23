import { Module } from '@nestjs/common';
import { ToolsModule } from '../tools/tools.module';
import { MemoryModule } from '../memory/memory.module';
import { ChatAgent } from './chat.agent';

@Module({
  imports: [ToolsModule, MemoryModule],
  providers: [ChatAgent],
  exports: [ChatAgent],
})
export class AgentsModule {}
