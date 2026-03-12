import { describe, expect, it } from 'vitest';
import { generateUUIDFallback } from './uuidGenerator';

describe('generateUUID', () => {
  it('should generate valid UUID v4 format with generateUUIDFallback', async () => {
    const result = generateUUIDFallback();

    // UUID v4 format validation
    expect(result).toHaveLength(36);
    expect(result.split('-')).toHaveLength(5);
    expect(result[14]).toBe('4'); // Version 4
    expect(['8', '9', 'a', 'b']).toContain(result[19]); // Variant
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should generate different UUIDs on subsequent calls with generateUUIDFallback', () => {
    const uuid1 = generateUUIDFallback();
    const uuid2 = generateUUIDFallback();
    const uuid3 = generateUUIDFallback();

    expect(uuid1).not.toBe(uuid2);
    expect(uuid2).not.toBe(uuid3);
    expect(uuid1).not.toBe(uuid3);
  });

  it('should generate UUIDs with correct variant bits in generateUUIDFallback', () => {
    // Generate multiple UUIDs to test the variant calculation
    for (let i = 0; i < 10; i++) {
      const result = generateUUIDFallback();
      const variantChar = result[19];

      // Ensure variantChar exists
      expect(variantChar).toBeDefined();
      const variantValue = parseInt(variantChar!, 16);

      // Variant bits should be 10xx in binary (8, 9, a, b in hex)
      expect(variantValue & 0xc).toBe(0x8);
    }
  });
});
