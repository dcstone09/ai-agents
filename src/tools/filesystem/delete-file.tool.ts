import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { BaseFileTool } from './base-file.tool';
import { z } from 'zod';

const DeleteFileSchema = z.object({
  path: z.string().describe('The path to the file to delete'),
});

@Injectable()
export class DeleteFileTool extends BaseFileTool<typeof DeleteFileSchema> {
  name = 'delete_file';
  description = 'Delete a file at the specified path';
  schema = DeleteFileSchema;

  protected async _call({
    path,
  }: z.infer<typeof DeleteFileSchema>): Promise<string> {
    try {
      await fs.unlink(path);
      return 'File deleted successfully';
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
