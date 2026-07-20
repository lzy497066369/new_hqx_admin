<script setup lang="ts">
import type { EnterpriseWorkspaceMaterialRecord } from '#/api';

import { shallowRef } from 'vue';

import { Button } from 'antdv-next';
import { Download, IconifyIcon } from '@vben/icons';

import {
  downloadEnterpriseWorkspaceMaterialTemplateApi,
  uploadEnterpriseWorkspaceMaterialApi,
} from '#/api';

import { showActionFailure, showActionSuccess } from '../../../../system/shared/action-feedback';
import { getMaterialTemplateConfig } from '../material-template-config';

interface Props {
  enterpriseId: string;
  templateId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ imported: [record: EnterpriseWorkspaceMaterialRecord] }>();
const importing = shallowRef(false);
const config = getMaterialTemplateConfig(props.templateId);

async function downloadTemplate() {
  try {
    const blob = await downloadEnterpriseWorkspaceMaterialTemplateApi(props.templateId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = config.fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    showActionFailure(error);
  }
}

async function importTemplate(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;

  importing.value = true;
  try {
    const record = await uploadEnterpriseWorkspaceMaterialApi(
      props.enterpriseId,
      props.templateId,
      file,
    );
    emit('imported', record);
    showActionSuccess(record.status === 'valid' ? '资料已导入' : '资料已解析，请查看导入记录');
  } catch (error) {
    showActionFailure(error);
  } finally {
    importing.value = false;
  }
}
</script>

<template>
  <Button @click="downloadTemplate"><Download class="size-4" />下载模板</Button>
  <label class="enterprise-material-template-actions__upload">
    <Button :loading="importing"><IconifyIcon icon="lucide:upload" class="size-4" />导入资料</Button>
    <input :accept="config.accept" type="file" @change="importTemplate" />
  </label>
</template>

<style scoped>
.enterprise-material-template-actions__upload input { display: none; }
</style>
