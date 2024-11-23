import { z } from 'zod';

export const BashOperationSchema = z.object({
  command: z.string(),
  options: z
    .object({
      cwd: z.string().optional(),
      timeout: z.number().optional(),
      maxBuffer: z.number().optional(),
    })
    .optional(),
});

export type BashOperation = z.infer<typeof BashOperationSchema>;
