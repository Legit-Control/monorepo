import { describe, it, expect, beforeEach } from 'vitest';

describe('Basic functionality', () => {
  it('should pass a simple test', () => {
    expect(true).toBe(true);
  });

  it('should handle basic math', () => {
    expect(2 + 2).toBe(4);
  });
});