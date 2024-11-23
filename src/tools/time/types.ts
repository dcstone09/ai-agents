import { z } from 'zod';

export const TimeOperationSchema = z.object({
  operation: z.enum(['getCurrentTime', 'getCurrentDate', 'getTimestamp']),
  params: z
    .object({
      timezone: z.string().optional(), // e.g. 'America/New_York'
      format: z.string().optional(), // e.g. 'YYYY-MM-DD HH:mm:ss'
    })
    .optional(),
});

export type TimeOperation = z.infer<typeof TimeOperationSchema>;
