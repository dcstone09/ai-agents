import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { BaseTool } from '../base.tool';
import { z } from 'zod';
import { WebFetchSchema } from './types';
import { Browser, chromium } from 'playwright';

@Injectable()
export class WebFetchTool
  extends BaseTool<typeof WebFetchSchema>
  implements OnModuleInit, OnModuleDestroy
{
  name = 'web_fetch';
  description =
    'Fetch content from a webpage using a real browser. Can return text content or HTML.';
  schema = WebFetchSchema;

  private browser: Browser;

  async onModuleInit() {
    this.browser = await chromium.launch();
  }

  async onModuleDestroy() {
    await this.browser?.close();
  }

  protected async _call({
    url,
    options,
  }: z.infer<typeof WebFetchSchema>): Promise<string> {
    try {
      const context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (compatible; LangChainBot/1.0)',
      });

      const page = await context.newPage();

      await page.goto(url, {
        timeout: options?.timeout || 30000,
        waitUntil: 'networkidle',
      });

      if (options?.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, {
          timeout: options?.timeout || 30000,
        });
      }

      let result: string;

      // Get content based on preference
      if (options?.includeHtml) {
        result = await page.content();
      } else {
        // Get text content, excluding scripts and styles
        result = await page.evaluate(() => {
          const scripts = document.querySelectorAll('script, style');
          scripts.forEach((script) => script.remove());
          return document.body.innerText;
        });
      }

      await context.close();
      return result.trim();
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
