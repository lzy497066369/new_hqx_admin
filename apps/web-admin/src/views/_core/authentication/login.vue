<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { isIamAuthEnabled } from '#/auth/iam-sso';
import { $t } from '#/locales';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const pageTitle = computed(() => `${preferences.app.name} ${$t('page.auth.adminPlatform')}`);
const pageDescription = computed(() => $t('page.auth.loginDesc'));

const formSchema = computed((): VbenFormSchema[] => {
  if (isIamAuthEnabled()) {
    return [];
  }

  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('page.auth.loginAccountPlaceholder'),
      },
      fieldName: 'username',
      label: $t('page.auth.loginAccount'),
      rules: z.string().min(1, { message: $t('page.auth.loginAccountPlaceholder') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('page.auth.passwordPlaceholder'),
      },
      fieldName: 'password',
      label: $t('page.auth.password'),
      rules: z.string().min(1, { message: $t('page.auth.passwordPlaceholder') }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('page.auth.captchaRequired'),
      }),
    },
  ];
});
</script>

<template>
  <AuthenticationLogin
    :page-description="pageDescription"
    :page-title="pageTitle"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    :show-code-login="false"
    :show-qrcode-login="false"
    :show-register="false"
    :show-third-party-login="false"
    @submit="authStore.authLogin"
  />
</template>
