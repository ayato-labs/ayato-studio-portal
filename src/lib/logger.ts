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
        level: 'info',
      },
      {
        target: 'pino/file',
        options: { destination: './logs/error.log', mkdir: true },
        level: 'error',
      },
      {
        target: 'pino-pretty',
        level: 'debug',
        options: { colorize: true },
      },
    ],
  });

  return pino(
    {
      level: process.env.LOG_LEVEL || 'debug',
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport,
  );
};

export const logger = configureLogger();

/**
 * A higher-order function that wraps an asynchronous operation with error handling.
 *
 * This utility centralizes error logging through the standard logger while
 * preventing the application from crashing due to unhandled promise rejections.
 *
 * @param fn - The asynchronous function to execute.
 * @param context - Additional metadata to include in the error log for debugging.
 * @returns The result of the function if successful, or null if an error occurred.
 *
 * @example
 * const data = await withErrorGuard(() => fetchUserData(id), { userId: id });
 * if (!data) return handleFailure();
 */
export async function withErrorGuard<T>(
  fn: () => Promise<T>,
  context: Record<string, unknown> = {},
): Promise<T | null> {
  try {
    return await fn();
  } catch (error: any) {
    logger.error(
      {
        ...context,
        error: {
          message: error.message,
          stack: error.stack,
          code: error.code,
        },
      },
      'Unhandled error captured in guard',
    );

    return null;
  }
}
