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
import { WebFetchTool } from './web/web-fetch.tool';
import { WebClickTool } from './web/web-click.tool';
import { WebInputTool } from './web/web-input.tool';
import { BrowserService } from './web/browser.service';
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
    WebFetchTool,
    WebClickTool,
    WebInputTool,
    BrowserService,
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
    WebFetchTool,
    WebClickTool,
    WebInputTool,
  ],
})
export class ToolsModule {}
