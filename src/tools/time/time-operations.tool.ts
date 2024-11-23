import { Injectable } from '@nestjs/common';
import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

const TimeOperationSchema = z.object({
  operation: z
    .enum(['getCurrentTime', 'getCurrentDate', 'getTimestamp'])
    .describe('The time operation to perform'),
  params: z
    .object({
      timezone: z
        .string()
        .optional()
        .describe('Optional timezone for time/date operations'),
    })
    .optional(),
});

@Injectable()
export class TimeOperationsTool extends StructuredTool {
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
