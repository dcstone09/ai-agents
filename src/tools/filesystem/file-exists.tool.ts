import { Injectable } from '@nestjs/common';
import { BaseFileTool } from './base-file.tool';
import { z } from 'zod';

const FileExistsSchema = z.object({
  path: z.string().describe('The path to check for file existence'),
});

@Injectable()
export class FileExistsTool extends BaseFileTool {
  name = 'file_exists';
  description = 'Check if a file exists at the specified path';
  schema = FileExistsSchema;

  protected async _call({
    path,
  }: z.infer<typeof FileExistsSchema>): Promise<string> {
    try {
      return String(await this.fileExists(path));
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
