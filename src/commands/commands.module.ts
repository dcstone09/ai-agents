import { Module } from '@nestjs/common';
import { AgentsModule } from '../agents/agents.module';
import { ChatCommand } from './chat/chat.command';

@Module({
  imports: [AgentsModule],
  providers: [ChatCommand],
})
export class CommandsModule {}
