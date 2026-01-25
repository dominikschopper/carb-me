import { describe, it, expect } from 'vitest';
import { formatNumber, formatDate, formatDateShort } from './formatting';

describe('formatNumber', () => {
  it('formats whole numbers with one decimal', () => {
    expect(formatNumber(5)).toBe('5,0');
  });

  it('formats numbers with one decimal place', () => {
    expect(formatNumber(3.5)).toBe('3,5');
  });

  it('formats numbers with two decimal places', () => {
    expect(formatNumber(2.75)).toBe('2,75');
  });

  it('rounds to maximum two decimal places', () => {
    expect(formatNumber(1.234)).toBe('1,23');
    expect(formatNumber(1.235)).toBe('1,24'); // rounds up
  });

  it('uses comma as decimal separator (German locale)', () => {
    expect(formatNumber(10.5)).toContain(',');
    expect(formatNumber(10.5)).not.toContain('.');
  });

  it('formats zero correctly', () => {
    expect(formatNumber(0)).toBe('0,0');
  });

  it('formats negative numbers', () => {
    expect(formatNumber(-5.5)).toBe('-5,5');
  });

  it('formats large numbers with thousand separators', () => {
    const result = formatNumber(1234.5);
    // German locale uses dot as thousand separator
    expect(result).toBe('1.234,5');
  });
});

describe('formatDate', () => {
  it('formats a timestamp to German date format', () => {
    // 2024-01-15 14:30:00 UTC
    const timestamp = new Date('2024-01-15T14:30:00Z').getTime();
    const result = formatDate(timestamp);

    // German medium format: "15.01.2024, HH:MM"
    expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/); // DD.MM.YYYY format
    expect(result).toMatch(/2024/); // Year
  });

  it('includes time in format', () => {
    const timestamp = new Date('2024-01-15T14:30:00').getTime();
    const result = formatDate(timestamp);

    // Should contain time components
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});

describe('formatDateShort', () => {
  it('formats date in short format', () => {
    // Note: This will be in local timezone
    const timestamp = new Date('2024-03-20T10:45:00').getTime();
    const result = formatDateShort(timestamp);

    // Should contain day.month format
    expect(result).toMatch(/20\.03/);

    // Should contain time
    expect(result).toMatch(/10:45/);
  });

  it('pads single digit days and months', () => {
    const timestamp = new Date('2024-01-05T09:05:00').getTime();
    const result = formatDateShort(timestamp);

    // Should have leading zeros
    expect(result).toMatch(/05\.01/);
  });
});
