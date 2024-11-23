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

export const WebInputSchema = z.object({
  url: z.string().url().describe('Current page URL'),
  selector: z.string().describe('CSS selector of input element'),
  text: z.string().describe('Text to type into the element'),
  options: z
    .object({
      clearFirst: z
        .boolean()
        .optional()
        .describe('Whether to clear the input first'),
      pressEnter: z
        .boolean()
        .optional()
        .describe('Whether to press Enter after typing'),
      delay: z.number().optional().describe('Delay between keystrokes'),
    })
    .optional(),
});

export const WebClickSchema = z.object({
  url: z.string().url().describe('Current page URL'),
  selector: z.string().describe('CSS selector of element to click'),
  options: z
    .object({
      waitForNavigation: z
        .boolean()
        .optional()
        .describe('Whether to wait for navigation after click'),
      timeout: z.number().optional().describe('Click timeout in milliseconds'),
      button: z
        .enum(['left', 'right', 'middle'])
        .optional()
        .describe('Mouse button to click with'),
      clickCount: z.number().optional().describe('Number of clicks'),
      force: z
        .boolean()
        .optional()
        .describe('Force click even if element not visible'),
    })
    .optional(),
});
