import { Injectable } from '@nestjs/common';
import { Tool } from '@langchain/core/tools';
import { promises as fs } from 'fs';
import { FileOperation, FileOperationSchema } from './types';

@Injectable()
export class FileOperationsTool extends Tool {
  name = 'file_operations';
  description =
    'Tool for performing file system operations like reading, writing, and deleting files';

  protected async _call(input: string): Promise<string> {
    try {
      const request = FileOperationSchema.parse(JSON.parse(input));
      return await this.handleOperation(request);
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }

  private async handleOperation(request: FileOperation): Promise<string> {
    const { operation, params } = request;

    switch (operation) {
      case 'readFile':
        return await this.readFile(params.path);

      case 'writeFile':
        if (!params.content) {
          throw new Error('Content is required for writeFile operation');
        }
        await this.writeFile(params.path, params.content);
        return 'File written successfully';

      case 'appendFile':
        if (!params.content) {
          throw new Error('Content is required for appendFile operation');
        }
        await this.appendFile(params.path, params.content);
        return 'Content appended successfully';

      case 'deleteFile':
        await this.deleteFile(params.path);
        return 'File deleted successfully';

      case 'fileExists':
        return String(await this.fileExists(params.path));

      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  }

  private async readFile(path: string): Promise<string> {
    return await fs.readFile(path, 'utf-8');
  }

  private async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content, 'utf-8');
  }

  private async appendFile(path: string, content: string): Promise<void> {
    await fs.appendFile(path, content, 'utf-8');
  }

  private async deleteFile(path: string): Promise<void> {
    await fs.unlink(path);
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
}
