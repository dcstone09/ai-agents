import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { BaseFileTool } from './base-file.tool';
import { z } from 'zod';

const WriteFileSchema = z.object({
  path: z.string().describe('The path where to write the file'),
  content: z.string().describe('The content to write to the file'),
});

@Injectable()
export class WriteFileTool extends BaseFileTool<typeof WriteFileSchema> {
  name = 'write_file';
  description = 'Write content to a file at the specified path';
  schema = WriteFileSchema;

  protected async _call({
    path,
    content,
  }: z.infer<typeof WriteFileSchema>): Promise<string> {
    try {
      await fs.writeFile(path, content, 'utf-8');
      return 'File written successfully';
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
