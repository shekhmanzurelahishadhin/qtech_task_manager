import { describe, it, expect } from 'vitest';
import { formatRelativeTime, formatDate, STATUS_CONFIG, FILTER_OPTIONS, STATUS_OPTIONS } from '../utils';

describe('STATUS_CONFIG', () => {
  it('has entries for all three statuses', () => {
    expect(STATUS_CONFIG).toHaveProperty('pending');
    expect(STATUS_CONFIG).toHaveProperty('in_progress');
    expect(STATUS_CONFIG).toHaveProperty('completed');
  });

  it('each entry has required display fields', () => {
    for (const config of Object.values(STATUS_CONFIG)) {
      expect(config).toHaveProperty('label');
      expect(config).toHaveProperty('color');
      expect(config).toHaveProperty('bg');
      expect(config).toHaveProperty('dot');
    }
  });
});

describe('FILTER_OPTIONS', () => {
  it('includes "all" as first option', () => {
    expect(FILTER_OPTIONS[0].value).toBe('all');
  });

  it('includes all three status filters', () => {
    const values = FILTER_OPTIONS.map((o) => o.value);
    expect(values).toContain('pending');
    expect(values).toContain('in_progress');
    expect(values).toContain('completed');
  });
});

describe('STATUS_OPTIONS', () => {
  it('has exactly three status options', () => {
    expect(STATUS_OPTIONS).toHaveLength(3);
  });

  it('does not include "all" option', () => {
    const values = STATUS_OPTIONS.map((o) => o.value);
    expect(values).not.toContain('all');
  });
});

describe('formatRelativeTime', () => {
  it('returns "Just now" for very recent timestamps', () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe('Just now');
  });

  it('returns minutes ago for timestamps within the hour', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago');
  });

  it('returns hours ago for timestamps within the day', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');
  });

  it('returns days ago for timestamps within the week', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toBe('3d ago');
  });
});

describe('formatDate', () => {
  it('returns a non-empty string for a valid ISO date', () => {
    const result = formatDate('2024-06-15T10:30:00.000Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the year in the output', () => {
    const result = formatDate('2024-06-15T10:30:00.000Z');
    expect(result).toContain('2024');
  });
});
