import { Module } from '@nestjs/common';
import { FileOperationsTool } from './filesystem/file-operations.tool';
import { BashOperationsTool } from './bash/bash-operations.tool';
import { TimeOperationsTool } from './time/time-operations.tool';

@Module({
  providers: [FileOperationsTool, BashOperationsTool, TimeOperationsTool],
  exports: [FileOperationsTool, BashOperationsTool, TimeOperationsTool],
})
export class ToolsModule {}
