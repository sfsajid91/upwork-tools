declare module 'bun:test' {
  interface Matchers {
    not: Matchers;
    toBe(value: unknown): void;
    toBeCloseTo(value: number): void;
    toEqual(value: unknown): void;
    toBeNull(): void;
    toBeUndefined(): void;
    toHaveLength(value: number): void;
    toMatchObject(value: Record<string, unknown>): void;
    toContain(value: unknown): void;
    toThrow(value?: unknown): void;
    toHaveProperty(key: string, value?: unknown): void;
    rejects: Matchers;
  }

  export function afterAll(callback: () => void | Promise<void>): void;
  export function beforeEach(callback: () => void | Promise<void>): void;
  export function afterEach(callback: () => void | Promise<void>): void;
  export function describe(name: string, callback: () => void): void;
  export function expect(value: unknown): Matchers;
  export function test(name: string, callback: () => void | Promise<void>): void;
  export const mock: {
    module(specifier: string, factory: () => Record<string, unknown>): void;
  };
}
