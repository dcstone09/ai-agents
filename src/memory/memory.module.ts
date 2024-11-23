import { Module } from '@nestjs/common';
import { MemoryManager } from './memory-manager.service';

@Module({
  providers: [MemoryManager],
  exports: [MemoryManager],
})
export class MemoryModule {}
