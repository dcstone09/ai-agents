import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { BaseFileTool } from './base-file.tool';
import { z } from 'zod';

const ReadFileSchema = z.object({
  path: z.string().describe('The path to the file to read'),
});

@Injectable()
export class ReadFileTool extends BaseFileTool<typeof ReadFileSchema> {
  name = 'read_file';
  description = 'Read the contents of a file at the specified path';
  schema = ReadFileSchema;

  protected async _call({
    path,
  }: z.infer<typeof ReadFileSchema>): Promise<string> {
    try {
      return await fs.readFile(path, 'utf-8');
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
