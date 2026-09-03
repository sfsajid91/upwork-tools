import { describe, expect, test } from 'bun:test';
import { logger } from '../../src/lib/logger';

describe('conditional logger', () => {
  test('suppresses logs when import.meta.env.DEV is falsy', () => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const logCalls: unknown[][] = [];
    const warnCalls: unknown[][] = [];
    const errorCalls: unknown[][] = [];

    console.log = (...args: unknown[]) => {
      logCalls.push(args);
    };
    console.warn = (...args: unknown[]) => {
      warnCalls.push(args);
    };
    console.error = (...args: unknown[]) => {
      errorCalls.push(args);
    };

    try {
      import.meta.env.DEV = false;
      logger.log('test message');
      logger.warn('warning message');
      logger.error('error message');

      expect(logCalls).toHaveLength(0);
      expect(warnCalls).toHaveLength(0);
      expect(errorCalls).toHaveLength(0);
    } finally {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    }
  });

  test('outputs styled logs when import.meta.env.DEV is true', () => {
    const originalLog = console.log;
    const logCalls: unknown[][] = [];

    console.log = (...args: unknown[]) => {
      logCalls.push(args);
    };

    try {
      import.meta.env.DEV = true;
      logger.log('Interceptor initiated');

      expect(logCalls).toHaveLength(1);
      expect(logCalls[0]).toEqual([
        '%c[Upwork Tools]:%c',
        'color: #14a800; font-weight: bold;',
        'color: inherit;',
        'Interceptor initiated',
      ]);
    } finally {
      console.log = originalLog;
      import.meta.env.DEV = false;
    }
  });
});
