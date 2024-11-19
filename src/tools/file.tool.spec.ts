import { Test, TestingModule } from '@nestjs/testing';
import { FileTool } from './file.tool';
import { getLoggerToken } from 'nestjs-pino';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

jest.mock('fs/promises');

describe('FileTool', () => {
  let fileTool: FileTool;
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
  };

  const testDir = path.join(os.tmpdir(), 'test-files');
  const validPath = path.join(testDir, 'test.txt');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileTool,
        {
          provide: getLoggerToken(FileTool.name),
          useValue: mockLogger,
        },
      ],
    }).compile();

    fileTool = module.get<FileTool>(FileTool);

    // Mock file stats for size and permissions checks
    (fs.stat as jest.Mock).mockResolvedValue({
      size: 1024,
      mode: 0o666,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('readFile', () => {
    it('should read file content', async () => {
      const testContent = 'test content';
      (fs.readFile as jest.Mock).mockResolvedValue(testContent);

      const result = await fileTool.readFile(validPath);
      expect(result).toBe(testContent);
    });

    it('should throw error for invalid path', async () => {
      await expect(fileTool.readFile('../test.txt')).rejects.toThrow();
    });
  });

  describe('writeFile', () => {
    it('should write content to file', async () => {
      const testContent = 'test content';
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
      (fs.rename as jest.Mock).mockResolvedValue(undefined);

      await fileTool.writeFile(validPath, testContent);

      expect(fs.writeFile).toHaveBeenCalledWith(
        `${validPath}.tmp`,
        testContent,
        'utf8',
      );
      expect(fs.rename).toHaveBeenCalledWith(`${validPath}.tmp`, validPath);
    });

    it('should throw error for invalid path', async () => {
      await expect(
        fileTool.writeFile('../test.txt', 'content'),
      ).rejects.toThrow();
    });
  });

  describe('updateFile', () => {
    it('should update existing file', async () => {
      const testContent = 'updated content';
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await fileTool.updateFile(validPath, testContent);

      expect(fs.writeFile).toHaveBeenCalledWith(validPath, testContent, 'utf8');
    });

    it('should throw error if file does not exist', async () => {
      (fs.access as jest.Mock).mockRejectedValue(new Error('File not found'));

      await expect(
        fileTool.updateFile(path.join(testDir, 'nonexistent.txt'), 'content'),
      ).rejects.toThrow();
    });
  });

  describe('deleteFile', () => {
    it('should delete file', async () => {
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      await fileTool.deleteFile(validPath);
      expect(fs.unlink).toHaveBeenCalledWith(validPath);
    });
  });

  describe('copyFile', () => {
    it('should copy file', async () => {
      const destPath = path.join(testDir, 'copy.txt');
      (fs.copyFile as jest.Mock).mockResolvedValue(undefined);

      await fileTool.copyFile(validPath, destPath);
      expect(fs.copyFile).toHaveBeenCalledWith(validPath, destPath);
    });
  });

  describe('listDirectory', () => {
    it('should list directory contents', async () => {
      const files = ['file1.txt', 'file2.txt'];
      (fs.readdir as jest.Mock).mockResolvedValue(files);

      const result = await fileTool.listDirectory(testDir);
      expect(result).toEqual(files);
    });
  });

  describe('createDirectory', () => {
    it('should create directory', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);

      await fileTool.createDirectory(testDir);
      expect(fs.mkdir).toHaveBeenCalledWith(testDir, { recursive: true });
    });
  });
});
