import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class EditorAgent {
  constructor(
    @InjectPinoLogger(EditorAgent.name)
    private readonly logger: PinoLogger,
  ) {}
  async run(prompt: string): Promise<void> {
    
  }
}
