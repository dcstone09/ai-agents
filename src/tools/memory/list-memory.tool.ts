import { Injectable } from '@nestjs/common';
import { BaseTool } from '../base.tool';
import { z } from 'zod';
import { MemoryManager } from '../../memory/memory-manager.service';

const ListMemorySchema = z.object({});

@Injectable()
export class ListMemoryTool extends BaseTool<typeof ListMemorySchema> {
  name = 'list_memory';
  description = 'List all keys stored in memory';
  schema = ListMemorySchema;

  constructor(private readonly memoryManager: MemoryManager) {
    super();
  }

  protected async _call(): Promise<string> {
    try {
      const keys = await this.memoryManager.listKeys();
      return `Available keys: ${JSON.stringify(keys, null, 2)}`;
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
