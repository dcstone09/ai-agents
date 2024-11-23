import { Injectable } from '@nestjs/common';
import { BaseTool } from '../base.tool';
import { z } from 'zod';
import { MemoryManager } from '../../memory/memory-manager.service';

const DeleteMemorySchema = z.object({
  key: z.string().describe('The key to delete from memory'),
});

@Injectable()
export class DeleteMemoryTool extends BaseTool<typeof DeleteMemorySchema> {
  name = 'delete_memory';
  description = 'Delete data from memory for a specified key';
  schema = DeleteMemorySchema;

  constructor(private readonly memoryManager: MemoryManager) {
    super();
  }

  protected async _call({
    key,
  }: z.infer<typeof DeleteMemorySchema>): Promise<string> {
    try {
      await this.memoryManager.delete(key);
      return `Successfully deleted key: ${key}`;
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
