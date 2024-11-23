import { z } from 'zod';

export const FileOperationSchema = z.object({
  operation: z.enum([
    'readFile',
    'writeFile',
    'appendFile',
    'deleteFile',
    'fileExists',
  ]),
  params: z.object({
    path: z.string(),
    content: z.string().optional(),
  }),
});

export type FileOperation = z.infer<typeof FileOperationSchema>;
