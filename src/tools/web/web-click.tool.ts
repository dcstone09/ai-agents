import { Injectable } from '@nestjs/common';
import { BaseTool } from '../base.tool';
import { z } from 'zod';
import { WebClickSchema } from './types';
import { BrowserService } from './browser.service';

@Injectable()
export class WebClickTool extends BaseTool<typeof WebClickSchema> {
  name = 'web_click';
  description = 'Click an element on a webpage using a CSS selector';
  schema = WebClickSchema;

  constructor(private readonly browserService: BrowserService) {
    super();
  }

  protected async _call({
    url,
    selector,
    options,
  }: z.infer<typeof WebClickSchema>): Promise<string> {
    try {
      const browser = this.browserService.getBrowser();
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (compatible; LangChainBot/1.0)',
      });

      const page = await context.newPage();
      await page.goto(url, {
        timeout: options?.timeout || 30000,
        waitUntil: 'networkidle',
      });

      // Wait for the element to be present
      await page.waitForSelector(selector, {
        timeout: options?.timeout || 30000,
      });

      // Click the element with specified options
      if (options?.waitForNavigation) {
        // Wait for navigation if specified
        await Promise.all([
          page.waitForNavigation({
            timeout: options?.timeout || 30000,
            waitUntil: 'networkidle',
          }),
          page.click(selector, {
            button: options?.button || 'left',
            clickCount: options?.clickCount || 1,
            force: options?.force || false,
            timeout: options?.timeout,
          }),
        ]);
      } else {
        await page.click(selector, {
          button: options?.button || 'left',
          clickCount: options?.clickCount || 1,
          force: options?.force || false,
          timeout: options?.timeout,
        });
      }

      // Get the current URL after click
      const currentUrl = page.url();

      await context.close();
      return `Successfully clicked element. New URL: ${currentUrl}`;
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
