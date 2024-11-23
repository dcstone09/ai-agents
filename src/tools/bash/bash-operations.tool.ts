import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { BaseTool } from '../base.tool';
import { BashOperation, BashOperationSchema } from './types';
import { z } from 'zod';

const execAsync = promisify(exec);

@Injectable()
export class BashOperationsTool extends BaseTool<typeof BashOperationSchema> {
  name = 'bash_operations';
  description = 'Tool for executing bash commands safely. Use with caution.';
  schema = BashOperationSchema;

  protected async _call(
    operation: z.infer<typeof BashOperationSchema>,
  ): Promise<string> {
    try {
      return await this.executeCommand(operation);
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }

  private async executeCommand(operation: BashOperation): Promise<string> {
    try {
      // Default options
      const options = {
        cwd: operation.options?.cwd || process.cwd(),
        timeout: operation.options?.timeout || 30000, // 30 seconds default timeout
        maxBuffer: operation.options?.maxBuffer || 1024 * 1024, // 1MB default max buffer
      };

      // Validate command for basic security
      this.validateCommand(operation.command);

      const { stdout, stderr } = await execAsync(operation.command, options);

      if (stderr) {
        return `Warning: Command produced stderr:\n${stderr}\nOutput:\n${stdout}`;
      }

      return stdout;
    } catch (error) {
      throw new Error(`Command execution failed: ${error.message}`);
    }
  }

  private validateCommand(command: string): void {
    // Basic security checks
    const dangerousPatterns = [
      /rm\s+-rf\s+\//, // Prevent root deletion
      />[>&]?\/dev\//, // Prevent writing to devices
      /mkfs/, // Prevent filesystem formatting
      /dd/, // Prevent direct disk access
      /sudo/, // Prevent sudo usage
      /\|\s*rm/, // Prevent piped deletions
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(command)) {
        throw new Error('Potentially dangerous command detected');
      }
    }
  }
}
