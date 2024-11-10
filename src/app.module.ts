import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { BashAgent } from './agents/bash.agent';
import { BashCommand } from './commands/bash.command';

@Module({
  imports: [],
  providers: [AppService, BashAgent, BashCommand],
})
export class AppModule {}
