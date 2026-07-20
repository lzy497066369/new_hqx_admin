<script setup lang="ts">
import type { EnterpriseWorkspaceAiDraft } from '#/api';

import { computed, shallowRef, watch } from 'vue';

import { Button, Checkbox, Empty, message, Modal, Table, Tag } from 'antdv-next';

import {
  approveEnterpriseWorkspaceResearchGenerationDraftsApi,
  createEnterpriseWorkspaceResearchAutoMatchTaskApi,
  getEnterpriseWorkspaceResearchGenerationDraftsApi,
} from '#/api';

defineOptions({ name: 'EnterpriseResearchGenerationModal' });

const props = defineProps<{ enterpriseId: string }>();
const open = defineModel<boolean>('open', { required: true });
const emit = defineEmits<{ approved: [] }>();
const drafts = shallowRef<EnterpriseWorkspaceAiDraft[]>([]);
const selectedIds = shallowRef<string[]>([]);
const loading = shallowRef(false);
const generating = shallowRef(false);
const approving = shallowRef(false);
const reviewDrafts = computed(() => drafts.value.filter((item) => item.status === 'reviewing'));
const columns = [
  { key: 'select', width: 48 },
  { dataIndex: 'status', key: 'status', title: '状态', width: 96 },
  { key: 'name', title: '研发项目名称', width: 260 },
  { key: 'number', title: '项目编号', width: 140 },
  { key: 'leader', title: '负责人', width: 120 },
  { key: 'period', title: '研发周期', width: 190 },
  { key: 'ips', title: '关联 IP', width: 180 },
];

watch(() => [open.value, props.enterpriseId] as const, ([visible]) => { if (visible) void loadDrafts(); });

function valueOf(draft: EnterpriseWorkspaceAiDraft, key: string) { return String(draft.draftPayload[key] ?? '-'); }
function statusLabel(status: string) { return ({ approved: '已入库', rejected: '已作废', reviewing: '待审核' } as Record<string, string>)[status] ?? status; }
function statusColor(status: string) { return ({ approved: 'success', rejected: 'default', reviewing: 'processing' } as Record<string, string>)[status] ?? 'default'; }

async function loadDrafts() { if (!props.enterpriseId) return; loading.value = true; try { const result = await getEnterpriseWorkspaceResearchGenerationDraftsApi(props.enterpriseId); drafts.value = result.items; selectedIds.value = result.items.filter((item) => item.status === 'reviewing').map((item) => item.id); } finally { loading.value = false; } }
async function generate() { generating.value = true; try { const result = await createEnterpriseWorkspaceResearchAutoMatchTaskApi(props.enterpriseId); message.success(`已提交 ${result.total} 条 RD 自动匹配草稿任务`); window.setTimeout(() => void loadDrafts(), 800); } finally { generating.value = false; } }
async function approve() { const ids = selectedIds.value.filter((id) => reviewDrafts.value.some((item) => item.id === id)); if (!ids.length) { message.warning('请选择待入库草稿'); return; } approving.value = true; try { const result = await approveEnterpriseWorkspaceResearchGenerationDraftsApi(props.enterpriseId, ids); if (result.success.length) { message.success(`已入库 ${result.success.length} 条研发项目`); emit('approved'); } if (result.failed.length) message.warning(`${result.failed.length} 条未入库：${result.failed[0]?.reason ?? ''}`); await loadDrafts(); } finally { approving.value = false; } }
function toggle(id: string, checked: boolean) { selectedIds.value = checked ? [...new Set([...selectedIds.value, id])] : selectedIds.value.filter((item) => item !== id); }
</script>

<template>
  <Modal v-model:open="open" :footer="null" title="RD 自动匹配草稿" width="min(1120px, calc(100vw - 48px))">
    <div class="research-generation">
      <div class="research-generation__toolbar"><span>根据当前企业已有 IP 的授权日期自动规划研发项目草稿。</span><div><Button :loading="generating" @click="generate">自动匹配生成</Button><Button :loading="loading" @click="loadDrafts">刷新</Button><Button type="primary" :loading="approving" @click="approve">审核入库</Button></div></div>
      <Table v-if="drafts.length" :columns="columns" :data-source="drafts" :loading="loading" :pagination="false" :row-key="(record: EnterpriseWorkspaceAiDraft) => record.id" :scroll="{ x: 1000, y: 460 }" size="small"><template #bodyCell="{ column, record }"><Checkbox v-if="column.key === 'select'" :checked="selectedIds.includes(record.id)" :disabled="record.status !== 'reviewing'" @update:checked="(checked) => toggle(record.id, checked)" /><Tag v-else-if="column.key === 'status'" :color="statusColor(record.status)">{{ statusLabel(record.status) }}</Tag><template v-else-if="column.key === 'name'">{{ valueOf(record, 'ky_project_name') }}</template><template v-else-if="column.key === 'number'">{{ valueOf(record, 'ky_project_num') }}</template><template v-else-if="column.key === 'leader'">{{ valueOf(record, 'ky_project_leader') }}</template><template v-else-if="column.key === 'period'">{{ valueOf(record, 'init_date') }} 至 {{ valueOf(record, 'end_date') }}</template><template v-else-if="column.key === 'ips'">{{ valueOf(record, 'related_ip_ids') }}</template></template></Table>
      <Empty v-else-if="!loading" description="暂无 RD 草稿" />
    </div>
  </Modal>
</template>

<style scoped>
.research-generation { display: grid; gap: 16px; }.research-generation__toolbar, .research-generation__toolbar > div { display: flex; gap: 12px; align-items: center; }.research-generation__toolbar { justify-content: space-between; color: hsl(var(--muted-foreground)); }@media (max-width: 760px) { .research-generation__toolbar { align-items: flex-start; flex-direction: column; }.research-generation__toolbar > div { flex-wrap: wrap; } }
</style>
