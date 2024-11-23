import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Browser, chromium } from 'playwright';

@Injectable()
export class BrowserService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BrowserService.name);
  private browser: Browser;

  async onModuleInit() {
    this.browser = await chromium.launch();
    this.logger.log('Browser initialized');
  }

  async onModuleDestroy() {
    await this.browser?.close();
    this.logger.log('Browser closed');
  }

  getBrowser(): Browser {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }
    return this.browser;
  }
}
