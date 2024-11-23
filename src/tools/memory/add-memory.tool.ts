import { Injectable } from '@nestjs/common';
import { BaseTool } from '../base.tool';
import { z } from 'zod';
import { MemoryManager } from '../../memory/memory-manager.service';

const AddMemorySchema = z.object({
  key: z.string().describe('The key to store the data under'),
  value: z.any().describe('The value to store'),
});

@Injectable()
export class AddMemoryTool extends BaseTool<typeof AddMemorySchema> {
  name = 'add_memory';
  description = 'Store data in memory under a specified key';
  schema = AddMemorySchema;

  constructor(private readonly memoryManager: MemoryManager) {
    super();
  }

  protected async _call({
    key,
    value,
  }: z.infer<typeof AddMemorySchema>): Promise<string> {
    try {
      await this.memoryManager.set(key, value);
      return `Successfully stored data under key: ${key}`;
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
