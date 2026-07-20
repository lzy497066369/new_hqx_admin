import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(
  resolve(__dirname, 'EnterpriseCardItem.vue'),
  'utf8',
);

describe('enterprise card actions', () => {
  it('provides direct material ledger and declaration management entry points', () => {
    expect(source).toContain('materialLedger: [EnterpriseProfileItem]');
    expect(source).toContain('declarations: [EnterpriseProfileItem]');
    expect(source).toContain("emit('materialLedger', props.item)");
    expect(source).toContain("emit('declarations', props.item)");
  });
});
