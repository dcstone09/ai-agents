import { Module } from '@nestjs/common';
import { FileOperationsTool } from './filesystem/file-operations.tool';
import { BashOperationsTool } from './bash/bash-operations.tool';

@Module({
  providers: [FileOperationsTool, BashOperationsTool],
  exports: [FileOperationsTool, BashOperationsTool],
})
export class ToolsModule {}
