const PREFIX = '%c[Upwork Tools]:%c';
const STYLE = 'color: #14a800; font-weight: bold;';
const RESET = 'color: inherit;';

const isDev = (): boolean =>
  Boolean(import.meta.env.DEV) && (import.meta.env.DEV as unknown) !== 'false';

export const logger = {
  log(...args: unknown[]): void {
    if (isDev()) {
      console.log(PREFIX, STYLE, RESET, ...args);
    }
  },
  warn(...args: unknown[]): void {
    if (isDev()) {
      console.warn(PREFIX, STYLE, RESET, ...args);
    }
  },
  error(...args: unknown[]): void {
    if (isDev()) {
      console.error(PREFIX, STYLE, RESET, ...args);
    }
  },
};
