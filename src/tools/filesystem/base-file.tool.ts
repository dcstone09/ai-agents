import { promises as fs } from 'fs';
import { BaseTool } from '../base.tool';
import { z } from 'zod';

export abstract class BaseFileTool<T extends z.ZodObject<any>> extends BaseTool<T> {
  protected async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
}
