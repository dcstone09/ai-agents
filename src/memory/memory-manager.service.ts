import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';

@Injectable()
export class MemoryManager {
  private readonly logger = new Logger(MemoryManager.name);
  private readonly memoryPath = 'memory.json';
  private memory: Record<string, any> = {};

  constructor() {
    this.initializeMemory();
  }

  private async initializeMemory() {
    try {
      const exists = await fs
        .access(this.memoryPath)
        .then(() => true)
        .catch(() => false);

      if (exists) {
        const content = await fs.readFile(this.memoryPath, 'utf-8');
        this.memory = JSON.parse(content);
        this.logger.log('Memory loaded from file');
      } else {
        await this.saveMemory();
        this.logger.log('New memory file created');
      }
    } catch (error) {
      this.logger.error('Failed to initialize memory', error);
    }
  }

  private async saveMemory() {
    try {
      await fs.writeFile(
        this.memoryPath,
        JSON.stringify(this.memory, null, 2),
        'utf-8',
      );
      this.logger.debug('Memory saved to file');
    } catch (error) {
      this.logger.error('Failed to save memory', error);
    }
  }

  async set(key: string, value: any): Promise<void> {
    this.memory[key] = value;
    await this.saveMemory();
  }

  async get(key: string): Promise<any | null> {
    await this.initializeMemory(); // Ensure fresh data
    return this.memory[key] ?? null;
  }

  async delete(key: string): Promise<void> {
    delete this.memory[key];
    await this.saveMemory();
  }

  async listKeys(): Promise<string[]> {
    await this.initializeMemory(); // Ensure fresh data
    return Object.keys(this.memory);
  }

  async getAll(): Promise<Record<string, any>> {
    await this.initializeMemory(); // Ensure fresh data
    return { ...this.memory };
  }

  async has(key: string): Promise<boolean> {
    await this.initializeMemory(); // Ensure fresh data
    return key in this.memory;
  }
}
