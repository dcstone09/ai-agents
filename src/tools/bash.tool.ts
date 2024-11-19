import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class BashTool {
  constructor(
    @InjectPinoLogger(BashTool.name)
    private readonly logger: PinoLogger,
  ) {}
  async execute(command: string): Promise<{ stdout: string; stderr: string }> {
    this.logger.info({ command }, 'Executing command');

    command = command.trim();

    if (!command || typeof command !== 'string') {
      throw new Error('Command must be a non-empty string');
    }

    if (
      command.includes('>') ||
      command.includes('|') ||
      command.includes('&')
    ) {
      throw new Error('Command contains forbidden characters');
    }

    if (command.length > 1000) {
      throw new Error('Command exceeds maximum length');
    }

    if (command.includes('rm -rf') || command.includes('sudo')) {
      throw new Error('Dangerous commands are not allowed');
    }

    try {
      const { stdout, stderr } = await execAsync(command);
      return { stdout, stderr };
    } catch (error) {
      throw new Error(`Failed to execute command: ${error.message}`);
    }
  }
}
