import { z } from 'zod';

export const MemoryOperationSchema = z.object({
  operation: z.enum(['add', 'get', 'delete', 'list']),
  params: z.object({
    key: z.string().describe('The key to store the data under'),
    value: z
      .any()
      .optional()
      .describe('The value to store (required for add operation)'),
  }),
});

export type MemoryOperation = z.infer<typeof MemoryOperationSchema>;
