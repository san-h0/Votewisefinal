import { describe, it, expect } from 'vitest';
import { sanitizeInput, normalizeSearchTerm } from '../utils/sanitize';

describe('sanitizeInput defensive XSS prevention', () => {
  it('strips script tags and inline payload', () => {
    const malicious = '<script>alert("hacked")</script>Hello Voter';
    const clean = sanitizeInput(malicious);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('alert("hacked")');
    expect(clean).toContain('Hello Voter');
  });

  it('strips dangerous javascript: protocol', () => {
    const malicious = '<a href="javascript:alert(1)">Click Me</a>';
    const clean = sanitizeInput(malicious);
    expect(clean).not.toContain('javascript:');
    expect(clean).toContain('Click Me');
  });

  it('escapes special characters to prevent HTML injection', () => {
    const raw = '<img src=x onerror="alert(1)">';
    const clean = sanitizeInput(raw);
    expect(clean).not.toContain('<img');
    expect(clean).not.toContain('onerror');
  });

  it('handles empty or non-string inputs safely', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput(null as unknown as string)).toBe('');
    expect(sanitizeInput(undefined as unknown as string)).toBe('');
  });
});

describe('normalizeSearchTerm', () => {
  it('normalizes queries to lowercase and alphanumeric format', () => {
    expect(normalizeSearchTerm('  <script>EVM</script> Wi-Fi??  ')).toBe('evm wi-fi');
    expect(normalizeSearchTerm('FORM-17A')).toBe('form-17a');
    expect(normalizeSearchTerm('VVPAT & Ballot')).toBe('vvpat  ballot');
  });
});
