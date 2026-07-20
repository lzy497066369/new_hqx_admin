<script setup lang="ts">
import type { EnterpriseWorkspaceAiDraft } from '#/api';

import { computed, shallowRef, watch } from 'vue';

import { Button, Checkbox, Empty, message, Modal, Table, Tag } from 'antdv-next';

import {
  approveEnterpriseWorkspaceProductServiceGenerationDraftsApi,
  createEnterpriseWorkspaceProductServiceGenerationTaskApi,
  getEnterpriseWorkspaceProductServiceGenerationDraftsApi,
} from '#/api';

defineOptions({ name: 'EnterpriseProductServiceGenerationModal' });

const props = defineProps<{ enterpriseId: string }>();
const open = defineModel<boolean>('open', { required: true });
const emit = defineEmits<{ approved: [] }>();
const drafts = shallowRef<EnterpriseWorkspaceAiDraft[]>([]);
const selectedIds = shallowRef<string[]>([]);
const loading = shallowRef(false);
const generating = shallowRef(false);
const approving = shallowRef(false);
const includeExisting = shallowRef(false);
const reviewDrafts = computed(() => drafts.value.filter((item) => item.status === 'reviewing'));
const columns = [{ key: 'select', width: 48 }, { dataIndex: 'status', key: 'status', title: '状态', width: 96 }, { key: 'name', title: '产品/服务名称', width: 240 }, { key: 'field', title: '技术领域', width: 180 }, { key: 'rds', title: '关联 RD', width: 170 }, { key: 'ips', title: '关联 IP', width: 170 }, { key: 'description', title: '技术说明', width: 280 }];
watch(() => [open.value, props.enterpriseId] as const, ([visible]) => { if (visible) void loadDrafts(); });
function valueOf(draft: EnterpriseWorkspaceAiDraft, key: string) { return String(draft.draftPayload[key] ?? '-'); }
function statusLabel(status: string) { return ({ approved: '已入库', rejected: '已作废', reviewing: '待审核' } as Record<string, string>)[status] ?? status; }
function statusColor(status: string) { return ({ approved: 'success', rejected: 'default', reviewing: 'processing' } as Record<string, string>)[status] ?? 'default'; }
async function loadDrafts() { if (!props.enterpriseId) return; loading.value = true; try { const result = await getEnterpriseWorkspaceProductServiceGenerationDraftsApi(props.enterpriseId); drafts.value = result.items; selectedIds.value = result.items.filter((item) => item.status === 'reviewing').map((item) => item.id); } finally { loading.value = false; } }
async function generate() { generating.value = true; try { const result = await createEnterpriseWorkspaceProductServiceGenerationTaskApi(props.enterpriseId, { includeExisting: includeExisting.value }); message.success(`已提交 ${result.total} 条 PS 草稿生成任务`); window.setTimeout(() => void loadDrafts(), 800); } finally { generating.value = false; } }
async function approve() { const ids = selectedIds.value.filter((id) => reviewDrafts.value.some((item) => item.id === id)); if (!ids.length) { message.warning('请选择待入库草稿'); return; } approving.value = true; try { const result = await approveEnterpriseWorkspaceProductServiceGenerationDraftsApi(props.enterpriseId, ids); if (result.success.length) { message.success(`已入库 ${result.success.length} 条产品服务`); emit('approved'); } if (result.failed.length) message.warning(`${result.failed.length} 条未入库：${result.failed[0]?.reason ?? ''}`); await loadDrafts(); } finally { approving.value = false; } }
function toggle(id: string, checked: boolean) { selectedIds.value = checked ? [...new Set([...selectedIds.value, id])] : selectedIds.value.filter((item) => item !== id); }
</script>

<template>
  <Modal v-model:open="open" :footer="null" title="PS 产品服务草稿生成" width="min(1180px, calc(100vw - 48px))"><div class="ps-generation"><div class="ps-generation__toolbar"><span>根据当前企业尚未关联 PS 的 RD 项目生成产品服务草稿。</span><div><Checkbox v-model:checked="includeExisting">包含已有 PS 关联 RD</Checkbox><Button :loading="generating" @click="generate">生成草稿</Button><Button :loading="loading" @click="loadDrafts">刷新</Button><Button type="primary" :loading="approving" @click="approve">审核入库</Button></div></div><Table v-if="drafts.length" :columns="columns" :data-source="drafts" :loading="loading" :pagination="false" :row-key="(record: EnterpriseWorkspaceAiDraft) => record.id" :scroll="{ x: 1100, y: 460 }" size="small"><template #bodyCell="{ column, record }"><Checkbox v-if="column.key === 'select'" :checked="selectedIds.includes(record.id)" :disabled="record.status !== 'reviewing'" @update:checked="(checked) => toggle(record.id, checked)" /><Tag v-else-if="column.key === 'status'" :color="statusColor(record.status)">{{ statusLabel(record.status) }}</Tag><template v-else-if="column.key === 'name'">{{ valueOf(record, 'ps_name') }}</template><template v-else-if="column.key === 'field'">{{ valueOf(record, 'tech_field') }}</template><template v-else-if="column.key === 'rds'">{{ valueOf(record, 'related_rd_ids') }}</template><template v-else-if="column.key === 'ips'">{{ valueOf(record, 'related_ip_ids') }}</template><span v-else-if="column.key === 'description'" class="ps-generation__description">{{ valueOf(record, 'tech_description') }}</span></template></Table><Empty v-else-if="!loading" description="暂无 PS 草稿" /></div></Modal>
</template>

<style scoped>
.ps-generation { display: grid; gap: 16px; }.ps-generation__toolbar, .ps-generation__toolbar > div { display: flex; gap: 12px; align-items: center; }.ps-generation__toolbar { justify-content: space-between; color: hsl(var(--muted-foreground)); }.ps-generation__description { white-space: normal; }@media (max-width: 760px) { .ps-generation__toolbar { align-items: flex-start; flex-direction: column; }.ps-generation__toolbar > div { flex-wrap: wrap; } }
</style>
