import { describe, expect, it } from 'vitest';

import { resolveClientHomePath } from './client-home-path';

describe('resolveClientHomePath', () => {
  it('maps the legacy home path to the dashboard route in IAM mode', () => {
    expect(resolveClientHomePath('/home')).toBe('/dashboard/workspace');
  });

  it('retains the local dashboard mapping for legacy login', () => {
    expect(resolveClientHomePath('/home')).toBe('/dashboard/workspace');
  });
});
