import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { BaseFileTool } from './base-file.tool';
import { z } from 'zod';

const AppendFileSchema = z.object({
  path: z.string().describe('The path to the file to append to'),
  content: z.string().describe('The content to append to the file'),
});

@Injectable()
export class AppendFileTool extends BaseFileTool {
  name = 'append_file';
  description = 'Append content to a file at the specified path';
  schema = AppendFileSchema;

  protected async _call({
    path,
    content,
  }: z.infer<typeof AppendFileSchema>): Promise<string> {
    try {
      await fs.appendFile(path, content, 'utf-8');
      return 'Content appended successfully';
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
