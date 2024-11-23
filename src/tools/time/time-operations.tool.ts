import { Injectable } from '@nestjs/common';
import { BaseTool } from '../base.tool';
import { z } from 'zod';
import { TimeOperationSchema } from './types';

@Injectable()
export class TimeOperationsTool extends BaseTool<typeof TimeOperationSchema> {
  name = 'time_operations';
  description =
    'Tool for getting current time information. Operations available: getCurrentTime (returns current time), getCurrentDate (returns current date), getTimestamp (returns Unix timestamp)';
  schema = TimeOperationSchema;

  protected async _call(
    request: z.infer<typeof TimeOperationSchema>,
  ): Promise<string> {
    try {
      return await this.handleOperation(request);
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }

  private async handleOperation(request: z.infer<typeof TimeOperationSchema>): Promise<string> {
    const { operation, params } = request;
    const now = new Date();

    switch (operation) {
      case 'getCurrentTime':
        if (params?.timezone) {
          return now.toLocaleTimeString('en-US', { timeZone: params.timezone });
        }
        return now.toLocaleTimeString();

      case 'getCurrentDate':
        if (params?.timezone) {
          return now.toLocaleDateString('en-US', { timeZone: params.timezone });
        }
        return now.toLocaleDateString();

      case 'getTimestamp':
        return now.getTime().toString();

      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  }
}
