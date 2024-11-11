import { Options } from 'pino-http';

export const pinoConfig: Options = {
  transport: {
    targets: [
      // Pretty printing to console for development
      {
        target: 'pino-pretty',
        level: 'info',
        options: {
          colorize: true,
          translateTime: true,
        },
      },
      // File transport for persistent logs
      {
        target: 'pino/file',
        level: 'info',
        options: {
          destination: `./sessions/${new Date().toISOString().replace(/[:.]/g, '-')}.log`,
          mkdir: true,
        },
      },
    ],
  },
};
