import { StructuredTool } from '@langchain/core/tools';
import { promises as fs } from 'fs';

export abstract class BaseFileTool extends StructuredTool {
  protected async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
}
