import { z } from 'zod';

export const WebFetchSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to fetch'),
  options: z
    .object({
      waitForSelector: z
        .string()
        .optional()
        .describe('CSS selector to wait for before capturing content'),
      timeout: z
        .number()
        .optional()
        .describe('Navigation timeout in milliseconds'),
      includeHtml: z
        .boolean()
        .optional()
        .describe('Whether to include HTML in the response'),
    })
    .optional(),
});
