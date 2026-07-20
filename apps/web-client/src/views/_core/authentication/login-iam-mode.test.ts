import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const loginViews = [
  resolve(process.cwd(), 'apps/web-client/src/views/_core/authentication/login.vue'),
  resolve(process.cwd(), 'apps/web-admin/src/views/_core/authentication/login.vue'),
];
const iamLoginView = resolve(
  process.cwd(),
  '../iam/iam_frontend/src/views/oauth/login/index.vue',
);

describe('IAM login mode', () => {
  it('skips local credential and captcha validation in both login views', () => {
    for (const loginView of loginViews) {
      const source = readFileSync(loginView, 'utf8');

      expect(source).toContain("import { isIamAuthEnabled } from '#/auth/iam-sso';");
      expect(source).toContain('if (isIamAuthEnabled()) {');
      expect(source).toContain('return [];');

    }
  });

  it('renders the IAM password input', () => {
    const source = readFileSync(iamLoginView, 'utf8');

    expect(source).toContain("import { Button, Form, FormItem, Input, InputPassword, message } from 'antdv-next';");
    expect(source).toContain('html-type="button" @click="login"');
  });
});
