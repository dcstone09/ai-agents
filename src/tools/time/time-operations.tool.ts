import { Injectable } from '@nestjs/common';
import { Tool } from '@langchain/core/tools';
import { TimeOperation, TimeOperationSchema } from './types';

@Injectable()
export class TimeOperationsTool extends Tool {
  name = 'time_operations';
  description =
    'Tool for getting current time information. Operations available: getCurrentTime (returns current time), getCurrentDate (returns current date), getTimestamp (returns Unix timestamp)';

  protected async _call(input: string): Promise<string> {
    try {
      const request = TimeOperationSchema.parse(JSON.parse(input));
      return await this.handleOperation(request);
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'An unknown error occurred';
    }
  }

  private async handleOperation(request: TimeOperation): Promise<string> {
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
