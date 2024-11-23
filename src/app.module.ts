import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { CoreModule } from './core/core.module';
import { AgentsModule } from './agents/agents.module';
import { ToolsModule } from './tools/tools.module';
import { MemoryModule } from './memory/memory.module';

@Module({
  imports: [LoggerModule.forRoot(), CoreModule, AgentsModule, ToolsModule, MemoryModule],
  providers: [],
  exports: [],
})
export class AppModule { }
