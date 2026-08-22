declare module 'bun:test' {
  interface Matchers {
    not: Matchers;
    toBe(value: unknown): void;
    toBeCloseTo(value: number): void;
    toEqual(value: unknown): void;
    toBeNull(): void;
  }

  export function describe(name: string, callback: () => void): void;
  export function expect(value: unknown): Matchers;
  export function test(name: string, callback: () => void): void;
}
