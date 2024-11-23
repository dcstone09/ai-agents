import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseAgent {
  constructor() {}

  abstract process(input: string): Promise<string>;
}
