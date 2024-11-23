import { Module } from '@nestjs/common';
import { ReadFileTool } from './filesystem/read-file.tool';
import { WriteFileTool } from './filesystem/write-file.tool';
import { AppendFileTool } from './filesystem/append-file.tool';
import { DeleteFileTool } from './filesystem/delete-file.tool';
import { FileExistsTool } from './filesystem/file-exists.tool';
import { BashOperationsTool } from './bash/bash-operations.tool';
import { TimeOperationsTool } from './time/time-operations.tool';
import { AddMemoryTool } from './memory/add-memory.tool';
import { GetMemoryTool } from './memory/get-memory.tool';
import { DeleteMemoryTool } from './memory/delete-memory.tool';
import { ListMemoryTool } from './memory/list-memory.tool';
import { MemoryModule } from '../memory/memory.module';

@Module({
  imports: [MemoryModule],
  providers: [
    ReadFileTool,
    WriteFileTool,
    AppendFileTool,
    DeleteFileTool,
    FileExistsTool,
    BashOperationsTool,
    TimeOperationsTool,
    AddMemoryTool,
    GetMemoryTool,
    DeleteMemoryTool,
    ListMemoryTool,
  ],
  exports: [
    ReadFileTool,
    WriteFileTool,
    AppendFileTool,
    DeleteFileTool,
    FileExistsTool,
    BashOperationsTool,
    TimeOperationsTool,
    AddMemoryTool,
    GetMemoryTool,
    DeleteMemoryTool,
    ListMemoryTool,
  ],
})
export class ToolsModule {}
