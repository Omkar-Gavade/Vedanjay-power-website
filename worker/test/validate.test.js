import { describe, it, expect } from 'vitest';
import {validateEnquiry, LIMITS } from '../lib/validate.js';


describe('validateEnquiry', () => {
  const valid = { name: 'A. Sharma', email: 'a@example.com', message: 'We have a 40 MW solar plant in MP.' };

  it('accepts a valid enquiry', () => {
    const r = validateEnquiry({ ...valid, source: 'chat' });
    expect(r.ok).toBe(true);
    expect(r.data.source).toBe('chat');
    expect(r.data.phone).toBeNull();
  });

  it.each([
    ['short name', { ...valid, name: 'A' }, 'name'],
    ['no email', { ...valid, email: '' }, 'email'],
    ['bad email', { ...valid, email: 'not-an-email' }, 'email'],
    ['short message', { ...valid, message: 'hi' }, 'message'],
  ])('rejects %s', (_l, body, field) => {
    const r = validateEnquiry(body);
    expect(r.ok).toBe(false);
    expect(r.fields).toHaveProperty(field);
  });

  it('defaults an unknown source rather than trusting it', () => {
    expect(validateEnquiry({ ...valid, source: 'injected' }).data.source).toBe('contact-form');
  });

  it('drops unknown fields — no unnecessary PII is accepted', () => {
    const r = validateEnquiry({ ...valid, company: 'X', budget: '10L', jobTitle: 'CTO' });
    expect(Object.keys(r.data).sort()).toEqual(['email', 'message', 'name', 'phone', 'source']);
  });
});
