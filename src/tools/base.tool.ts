import { StructuredTool } from '@langchain/core/tools';
import { Injectable, Logger } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { z } from 'zod';

@Injectable()
export abstract class BaseTool<
  T extends z.ZodObject<any>,
> extends StructuredTool {
  protected readonly logger: PinoLogger;

  constructor() {
    super();
    this.logger = new PinoLogger({});
    this.logger.setContext(this.constructor.name);
  }

  protected abstract _call(arg: z.infer<T>): Promise<string>;

  async call(arg: z.infer<T>): Promise<string> {
    try {
      this.logger.info(`Tool executing with args: ${JSON.stringify(arg)}`);
      const result = await this._call(arg);
      this.logger.info(`Tool execution result: ${result}`);
      return result;
    } catch (error) {
      this.logger.error(`Tool execution failed: ${error.message}`, error.stack);
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }
}
