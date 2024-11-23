import { Injectable } from '@nestjs/common';
import { BaseTool } from '../base.tool';
import { z } from 'zod';
import { MemoryManager } from '../../memory/memory-manager.service';

const GetMemorySchema = z.object({
  key: z.string().describe('The key to retrieve data from'),
});

@Injectable()
export class GetMemoryTool extends BaseTool<typeof GetMemorySchema> {
  name = 'get_memory';
  description = 'Retrieve data from memory for a specified key';
  schema = GetMemorySchema;

  constructor(private readonly memoryManager: MemoryManager) {
    super();
  }

  protected async _call({
    key,
  }: z.infer<typeof GetMemorySchema>): Promise<string> {
    try {
      const value = await this.memoryManager.get(key);
      if (value === null) {
        return `No data found for key: ${key}`;
      }
      return JSON.stringify(value, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
