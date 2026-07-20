<script setup lang="ts">
import type { EnterpriseWorkspaceFinanceAiDraft } from '#/api';

import { shallowRef, useTemplateRef, watch } from 'vue';

import { Button, Empty, Modal, Spin, Tag } from 'antdv-next';

import {
  approveEnterpriseWorkspaceFinanceAiParseDraftsApi,
  getEnterpriseWorkspaceFinanceAiParseDraftsApi,
  uploadEnterpriseWorkspaceFinanceAiParseFilesApi,
} from '#/api';

import { showActionFailure, showActionSuccess } from '../../../../system/shared/action-feedback';

interface Props {
  enterpriseId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ approved: [] }>();
const open = defineModel<boolean>('open', { required: true });
const fileInput = useTemplateRef<HTMLInputElement>('fileInput');
const drafts = shallowRef<EnterpriseWorkspaceFinanceAiDraft[]>([]);
const loading = shallowRef(false);
const uploading = shallowRef(false);
const approving = shallowRef(false);

function reset() {
  drafts.value = [];
}

function chooseFiles() {
  fileInput.value?.click();
}

async function loadDrafts() {
  if (!props.enterpriseId) return;
  loading.value = true;
  try {
    const result = await getEnterpriseWorkspaceFinanceAiParseDraftsApi(props.enterpriseId);
    drafts.value = result.items.filter((item) => item.status === 'reviewing');
  } catch (error) {
    showActionFailure(error);
  } finally {
    loading.value = false;
  }
}

async function upload(event: Event) {
  const files = Array.from((event.target as HTMLInputElement).files ?? []);
  (event.target as HTMLInputElement).value = '';
  if (!files.length) return;
  uploading.value = true;
  try {
    const result = await uploadEnterpriseWorkspaceFinanceAiParseFilesApi(props.enterpriseId, files);
    drafts.value = result.drafts;
    showActionSuccess('财税文件已解析，请核对后确认入库');
  } catch (error) {
    showActionFailure(error);
  } finally {
    uploading.value = false;
  }
}

async function approve() {
  const ids = drafts.value.map((item) => item.id);
  if (!ids.length) return;
  approving.value = true;
  try {
    const result = await approveEnterpriseWorkspaceFinanceAiParseDraftsApi(props.enterpriseId, ids);
    if (result.success.length) {
      showActionSuccess(`已确认入库 ${result.success.length} 条财税草稿`);
      emit('approved');
    }
    if (result.failed.length) {
      showActionFailure(new Error(result.failed.map((item) => item.reason).join('；')));
    }
    await loadDrafts();
  } catch (error) {
    showActionFailure(error);
  } finally {
    approving.value = false;
  }
}

watch(open, (value) => {
  if (value) void loadDrafts();
  else reset();
});
</script>

<template>
  <Modal v-model:open="open" :footer="null" title="财税 AI 解析" width="860px">
    <Spin :spinning="loading || uploading">
      <div class="enterprise-finance-ai-parse">
        <div class="enterprise-finance-ai-parse__toolbar">
          <p>上传 PDF、图片、CSV 或 Excel，确认后才写入当前企业的财税资料。</p>
          <div>
            <Button :loading="uploading" @click="chooseFiles">上传并解析</Button>
            <Button :disabled="!drafts.length" :loading="approving" type="primary" @click="approve">确认入库</Button>
          </div>
        </div>
        <input ref="fileInput" accept=".csv,.jpg,.jpeg,.pdf,.png,.xls,.xlsx" class="enterprise-finance-ai-parse__input" multiple type="file" @change="upload" />
        <div v-if="drafts.length" class="enterprise-finance-ai-parse__drafts">
          <article v-for="draft in drafts" :key="draft.id" class="enterprise-finance-ai-parse__draft">
            <div><strong>{{ draft.draftPayload.sourceFileName }}</strong><p>年度：{{ draft.draftPayload.year || '待确认' }}</p></div>
            <div><Tag :color="draft.draftPayload.parseStatus === 'success' ? 'green' : 'orange'">{{ draft.draftPayload.parseStatus }}</Tag><Tag>置信度 {{ draft.draftPayload.confidence }}</Tag></div>
            <p v-if="draft.draftPayload.reviewWarnings.length">{{ draft.draftPayload.reviewWarnings.join('；') }}</p>
          </article>
        </div>
        <Empty v-else-if="!loading" description="暂无待确认的财税解析草稿" />
      </div>
    </Spin>
  </Modal>
</template>

<style scoped>
.enterprise-finance-ai-parse { display: grid; gap: 16px; }.enterprise-finance-ai-parse__toolbar, .enterprise-finance-ai-parse__toolbar > div { display: flex; gap: 8px; align-items: center; }.enterprise-finance-ai-parse__toolbar { justify-content: space-between; }.enterprise-finance-ai-parse__toolbar p, .enterprise-finance-ai-parse__draft p { margin: 0; color: #6b7280; font-size: 13px; }.enterprise-finance-ai-parse__input { display: none; }.enterprise-finance-ai-parse__drafts { display: grid; gap: 10px; }.enterprise-finance-ai-parse__draft { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 12px; padding: 12px; border: 1px solid #e5e7eb; }.enterprise-finance-ai-parse__draft > p { grid-column: 1 / -1; }@media(max-width:640px){.enterprise-finance-ai-parse__toolbar{align-items:stretch;flex-direction:column;}}
</style>
