import { Injectable } from '@nestjs/common';
import { BaseTool } from '../base.tool';
import { z } from 'zod';
import { WebInputSchema } from './types';
import { BrowserService } from './browser.service';

@Injectable()
export class WebInputTool extends BaseTool<typeof WebInputSchema> {
  name = 'web_input';
  description =
    'Type text into an input element on a webpage using a CSS selector';
  schema = WebInputSchema;

  constructor(private readonly browserService: BrowserService) {
    super();
  }

  protected async _call({
    url,
    selector,
    text,
    options,
  }: z.infer<typeof WebInputSchema>): Promise<string> {
    try {
      const browser = this.browserService.getBrowser();
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (compatible; LangChainBot/1.0)',
      });

      const page = await context.newPage();
      await page.goto(url, {
        waitUntil: 'networkidle',
      });

      // Wait for the element to be present
      await page.waitForSelector(selector);

      // Clear the input if requested
      if (options?.clearFirst) {
        await page.fill(selector, '');
      }

      // Type the text with optional delay
      await page.type(selector, text, {
        delay: options?.delay,
      });

      // Press Enter if requested
      if (options?.pressEnter) {
        await page.press(selector, 'Enter');
        // Wait for potential navigation
        await page.waitForLoadState('networkidle');
      }

      const currentUrl = page.url();
      await context.close();

      return `Successfully typed text into element. Current URL: ${currentUrl}`;
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
