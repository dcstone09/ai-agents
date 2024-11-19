import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class FileTool {
  constructor(
    @InjectPinoLogger(FileTool.name)
    private readonly logger: PinoLogger,
  ) {}

  async readFile(filePath: string): Promise<string> {
    this.logger.info({ filePath }, 'Reading file');

    this.validatePath(filePath);

    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    this.logger.info({ filePath }, 'Writing file');

    this.validatePath(filePath);

    try {
      // Write to temporary file first
      const tempPath = `${filePath}.tmp`;
      await fs.writeFile(tempPath, content, 'utf8');
      await this.validateFileSize(tempPath);
      await this.checkFilePermissions(tempPath);

      // Atomically rename temp file to target file
      await fs.rename(tempPath, filePath);
    } catch (error) {
      throw new Error(`Failed to write file: ${error.message}`);
    }
  }

  async updateFile(filePath: string, content: string): Promise<void> {
    this.logger.info({ filePath }, 'Updating file');

    this.validatePath(filePath);

    try {
      // Check if file exists before updating
      await fs.access(filePath);
      await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to update file: ${error.message}`);
    }
  }

  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_EXTENSIONS = [
    '.txt',
    '.json',
    '.yml',
    '.yaml',
    '.md',
  ];
  private readonly ALLOWED_BASE_PATHS = [os.tmpdir(), './uploads', './data'];

  async deleteFile(filePath: string): Promise<void> {
    this.logger.info({ filePath }, 'Deleting file');
    this.validatePath(filePath);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
    this.logger.info({ sourcePath, destinationPath }, 'Copying file');
    this.validatePath(sourcePath);
    this.validatePath(destinationPath);

    try {
      await fs.copyFile(sourcePath, destinationPath);
    } catch (error) {
      throw new Error(`Failed to copy file: ${error.message}`);
    }
  }

  async listDirectory(dirPath: string): Promise<string[]> {
    this.logger.info({ dirPath }, 'Listing directory');
    this.validatePath(dirPath);

    try {
      return await fs.readdir(dirPath);
    } catch (error) {
      throw new Error(`Failed to list directory: ${error.message}`);
    }
  }

  async createDirectory(dirPath: string): Promise<void> {
    this.logger.info({ dirPath }, 'Creating directory');
    this.validatePath(dirPath);

    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory: ${error.message}`);
    }
  }

  private async validateFileSize(filePath: string): Promise<void> {
    const stats = await fs.stat(filePath);
    if (stats.size > this.MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds maximum limit of ${this.MAX_FILE_SIZE} bytes`,
      );
    }
  }

  private validatePath(filePath: string): void {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('File path must be a non-empty string');
    }

    // Normalize path and check for directory traversal attempts
    const normalizedPath = path.normalize(filePath);
    if (normalizedPath.includes('..')) {
      throw new Error('Directory traversal is not allowed');
    }

    // Validate file extension
    const ext = path.extname(filePath).toLowerCase();
    if (ext && !this.ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(`File extension ${ext} is not allowed`);
    }

    // Validate base path
    const isAllowedPath = this.ALLOWED_BASE_PATHS.some((basePath) =>
      normalizedPath.startsWith(path.resolve(basePath)),
    );
    if (!isAllowedPath) {
      throw new Error('File path is outside of allowed directories');
    }
  }

  private async checkFilePermissions(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      const mode = stats.mode & 0o777; // Get file permissions

      // Ensure file is readable and writable by current user
      if ((mode & 0o600) !== 0o600) {
        throw new Error('Insufficient file permissions');
      }
    } catch (error) {
      throw new Error(`Failed to check file permissions: ${error.message}`);
    }
  }
}
