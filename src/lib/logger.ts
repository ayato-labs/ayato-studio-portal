/**
 * Ayato Studio Portal - Structured Logger
 * Implementation of pino with custom rotation and error isolation.
 */

import pino from 'pino';

const isServer = typeof window === 'undefined';

const configureLogger = () => {
  if (!isServer) {
    // Browser side: Pretty log to console
    return pino({
      level: process.env.LOG_LEVEL || 'info',
      browser: { asObject: true },
    });
  }

  // Node.js environment: Multi-stream with isolation
  const transport = pino.transport({
    targets: [
      {
        target: 'pino/file',
        options: { destination: './logs/combined.log', mkdir: true },
        level: 'info'
      },
      {
        target: 'pino/file',
        options: { destination: './logs/error.log', mkdir: true },
        level: 'error'
      },
      {
        target: 'pino-pretty',
        level: 'debug',
        options: { colorize: true }
      }
    ]
  });

  return pino({
    level: process.env.LOG_LEVEL || 'debug',
    timestamp: pino.stdTimeFunctions.isoTime,
  }, transport);
};

export const logger = configureLogger();

/**
 * Error Guard Wrapper
 */
export async function withErrorGuard<T>(
  fn: () => Promise<T>,
  context: Record<string, unknown> = {}
): Promise<T | null> {
  try {
    return await fn();
  } catch (error: any) {
    logger.error({
      ...context,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code
      }
    }, 'Unhandled error captured in guard');
    
    return null;
  }
}
