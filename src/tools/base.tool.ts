import { StructuredTool } from '@langchain/core/tools';
import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export abstract class BaseTool<
  T extends z.ZodObject<any>,
> extends StructuredTool {
  protected readonly logger: Logger;

  constructor() {
    super();
    this.logger = new Logger(this.constructor.name);
  }

  protected abstract _call(arg: z.infer<T>): Promise<string>;

  async call(arg: z.infer<T>): Promise<string> {
    try {
      this.logger.debug(`Tool executing with args: ${JSON.stringify(arg)}`);
      const result = await this._call(arg);
      this.logger.debug(`Tool execution result: ${result}`);
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
