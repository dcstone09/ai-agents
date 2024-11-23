import { Module } from '@nestjs/common';
import { ReadFileTool } from './filesystem/read-file.tool';
import { WriteFileTool } from './filesystem/write-file.tool';
import { AppendFileTool } from './filesystem/append-file.tool';
import { DeleteFileTool } from './filesystem/delete-file.tool';
import { FileExistsTool } from './filesystem/file-exists.tool';
import { BashOperationsTool } from './bash/bash-operations.tool';
import { TimeOperationsTool } from './time/time-operations.tool';

@Module({
  providers: [
    ReadFileTool,
    WriteFileTool,
    AppendFileTool,
    DeleteFileTool,
    FileExistsTool,
    BashOperationsTool,
    TimeOperationsTool,
  ],
  exports: [
    ReadFileTool,
    WriteFileTool,
    AppendFileTool,
    DeleteFileTool,
    FileExistsTool,
    BashOperationsTool,
    TimeOperationsTool,
  ],
})
export class ToolsModule {}
