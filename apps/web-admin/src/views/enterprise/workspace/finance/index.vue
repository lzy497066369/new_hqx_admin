<script setup lang="ts">
import type {
  EnterpriseWorkspaceFinancialRecord,
  EnterpriseWorkspaceFinancialRecordInput,
  EnterpriseWorkspaceMaterialError,
  EnterpriseWorkspaceTaxAudit,
  EnterpriseWorkspaceTaxAuditInput,
} from '#/api';

import { computed, reactive, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { Button, Card, Empty, Form, FormItem, Input, InputNumber, Modal, Spin, Table, TabPane, Tabs } from 'antdv-next';

import {
  createEnterpriseWorkspaceFinancialRecordApi,
  createEnterpriseWorkspaceTaxAuditApi,
  deleteEnterpriseWorkspaceFinancialRecordApi,
  deleteEnterpriseWorkspaceTaxAuditApi,
  downloadEnterpriseWorkspaceMaterialTemplateApi,
  getEnterpriseWorkspaceFinancialRecordsApi,
  getEnterpriseWorkspaceMaterialErrorsApi,
  getEnterpriseWorkspaceTaxAuditsApi,
  previewEnterpriseWorkspaceAttachmentApi,
  updateEnterpriseWorkspaceFinancialRecordApi,
  updateEnterpriseWorkspaceTaxAuditApi,
  uploadEnterpriseWorkspaceArchiveAttachmentApi,
  uploadEnterpriseWorkspaceMaterialApi,
} from '#/api';

import { confirmAction, showActionFailure, showActionSuccess } from '../../../system/shared/action-feedback';
import { useEnterpriseContextStore } from '#/store';
import EnterpriseFinanceAiParseModal from './components/EnterpriseFinanceAiParseModal.vue';
import { resolveFinanceTab, type FinanceTab } from './finance-tab';
import { describeFinanceTemplateImport, financeTemplateId } from './finance-template-import';

defineOptions({ name: 'EnterpriseWorkspaceFinance' });

type FinanceItem = EnterpriseWorkspaceFinancialRecord | EnterpriseWorkspaceTaxAudit;

const route = useRoute();
const enterpriseContextStore = useEnterpriseContextStore();
const activeKey = shallowRef<FinanceTab>('financial');
const editing = shallowRef<FinanceItem>();
const editorOpen = shallowRef(false);
const financeAiParseOpen = shallowRef(false);
const financialRecords = shallowRef<EnterpriseWorkspaceFinancialRecord[]>([]);
const importing = shallowRef(false);
const importErrors = shallowRef<EnterpriseWorkspaceMaterialError[]>([]);
const importResultDescription = shallowRef('');
const importResultOpen = shallowRef(false);
const importResultTitle = shallowRef('导入结果');
const isLedgerView = computed(() => route.name === 'EnterpriseMaterialSection');
const loading = shallowRef(false);
const saving = shallowRef(false);
const taxAudits = shallowRef<EnterpriseWorkspaceTaxAudit[]>([]);
const financialForm = reactive<EnterpriseWorkspaceFinancialRecordInput>(newFinancial());
const taxAuditForm = reactive<EnterpriseWorkspaceTaxAuditInput>(newTaxAudit());

const financialColumns = [
  { dataIndex: 'year', key: 'year', title: '年度', width: 90 },
  { dataIndex: 'q', key: 'q', title: '季度', width: 82 },
  { dataIndex: 'xxsr', key: 'xxsr', title: '销售收入', width: 130 },
  { dataIndex: 'totalRevenue', key: 'totalRevenue', title: '总收入', width: 130 },
  { dataIndex: 'highTechIncome', key: 'highTechIncome', title: '高新收入', width: 130 },
  { dataIndex: 'rdExpense', key: 'rdExpense', title: '研发费用', width: 130 },
  { dataIndex: 'netProfit', key: 'netProfit', title: '净利润', width: 130 },
  { dataIndex: 'remark', key: 'remark', title: '备注', width: 180 },
  { key: 'actions', title: '操作', width: 130 },
];
const taxColumns = [
  { dataIndex: 'year', key: 'year', title: '年度' },
  { dataIndex: 'taxCategory', key: 'taxCategory', title: '税种/报告类别' },
  { dataIndex: 'filePath', key: 'filePath', title: '附件' },
  { dataIndex: 'remark', key: 'remark', title: '备注' },
  { key: 'actions', title: '操作' },
];
const currentColumns = computed(() => activeKey.value === 'financial' ? financialColumns : taxColumns);
const currentRows = computed(() => activeKey.value === 'financial' ? financialRecords.value : taxAudits.value);
const currentTitle = computed(() => activeKey.value === 'financial' ? '财务数据' : '纳税审计');

function enterpriseId() {
  return enterpriseContextStore.currentEnterpriseId ?? '';
}

function newFinancial(): EnterpriseWorkspaceFinancialRecordInput {
  return {
    fz: null, fzl: null, highTechIncome: null, lrTotal: null, mainBusinessIncome: null,
    netAssets: null, netProfit: null, q: 1, rdDepreciation: null, rdDesignFee: null,
    rdDirectInput: null, rdEntrustedDevelopment: null, rdEquipmentDebuggingFee: null,
    rdExpense: null, rdIntangibleAmortization: null, rdOtherExpense: null,
    rdPersonnelCost: null, remark: null, totalRevenue: null, xxsr: null, year: '', zxc: null,
  };
}

function newTaxAudit(): EnterpriseWorkspaceTaxAuditInput {
  return { fileClass: 1, filePath: null, remark: null, taxCategory: null, year: '' };
}

async function load() {
  const id = enterpriseId();
  if (!id) return;
  loading.value = true;
  try {
    const [financial, audits] = await Promise.all([
      getEnterpriseWorkspaceFinancialRecordsApi(id),
      getEnterpriseWorkspaceTaxAuditsApi(id),
    ]);
    financialRecords.value = financial;
    taxAudits.value = audits;
  } finally {
    loading.value = false;
  }
}

function openEditor(item?: FinanceItem) {
  editing.value = item;
  if (activeKey.value === 'financial') Object.assign(financialForm, newFinancial(), item ?? {});
  else Object.assign(taxAuditForm, newTaxAudit(), item ?? {});
  editorOpen.value = true;
}

async function save() {
  saving.value = true;
  try {
    if (activeKey.value === 'financial') {
      if (editing.value) await updateEnterpriseWorkspaceFinancialRecordApi(enterpriseId(), editing.value.id, financialForm);
      else await createEnterpriseWorkspaceFinancialRecordApi(enterpriseId(), financialForm);
    } else if (editing.value) {
      await updateEnterpriseWorkspaceTaxAuditApi(enterpriseId(), editing.value.id, taxAuditForm);
    } else {
      await createEnterpriseWorkspaceTaxAuditApi(enterpriseId(), taxAuditForm);
    }
    editorOpen.value = false;
    await load();
    showActionSuccess(editing.value ? `${currentTitle.value}已更新` : `${currentTitle.value}已新增`);
  } catch (error) {
    showActionFailure(error);
  } finally {
    saving.value = false;
  }
}

async function remove(item: FinanceItem) {
  try {
    await confirmAction(`确认删除 ${item.year ?? ''} 年度${currentTitle.value}记录吗？`, `删除${currentTitle.value}`);
    if (activeKey.value === 'financial') await deleteEnterpriseWorkspaceFinancialRecordApi(enterpriseId(), item.id);
    else await deleteEnterpriseWorkspaceTaxAuditApi(enterpriseId(), item.id);
    await load();
    showActionSuccess(`${currentTitle.value}已删除`);
  } catch (error) {
    if (error instanceof Error && error.message === 'cancel') return;
    showActionFailure(error);
  }
}

async function upload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  saving.value = true;
  try {
    const result = await uploadEnterpriseWorkspaceArchiveAttachmentApi(enterpriseId(), file);
    taxAuditForm.filePath = result.path;
    showActionSuccess('审计文件已上传');
  } catch (error) {
    showActionFailure(error);
  } finally {
    saving.value = false;
  }
}

async function downloadFinanceTemplate() {
  try {
    const blob = await downloadEnterpriseWorkspaceMaterialTemplateApi(financeTemplateId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = '财务信息模板.csv';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    showActionFailure(error);
  }
}

async function importFinanceTemplate(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  importing.value = true;
  try {
    const record = await uploadEnterpriseWorkspaceMaterialApi(enterpriseId(), financeTemplateId, file);
    const result = describeFinanceTemplateImport(record);
    await load();
    importResultTitle.value = result.title;
    importResultDescription.value = result.description;
    importErrors.value = record.errorCount ? await getEnterpriseWorkspaceMaterialErrorsApi(enterpriseId(), record.id) : [];
    importResultOpen.value = true;
    if (record.status === 'valid') showActionSuccess('财税数据已导入');
    else showActionFailure(new Error(record.status === 'partial' ? '部分数据已导入，请查看错误行' : '财税数据导入失败，请查看错误行'));
  } catch (error) {
    showActionFailure(error);
  } finally {
    importing.value = false;
  }
}

async function download(record: EnterpriseWorkspaceTaxAudit) {
  if (!record.filePath) return;
  try {
    const blob = await previewEnterpriseWorkspaceAttachmentApi(enterpriseId(), 'tax-audit', record.id, record.filePath);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = record.filePath.split('/').pop() || '审计附件';
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    showActionFailure(error);
  }
}

async function syncLedgerTab(tab: FinanceTab) {
  if (isLedgerView.value) enterpriseContextStore.setMaterialLedgerTab('finance', tab);
}

watch(() => enterpriseContextStore.currentEnterpriseId, () => void load(), { immediate: true });

watch(
  () => enterpriseContextStore.getMaterialLedgerTab('finance'),
  (tab) => {
    activeKey.value = resolveFinanceTab(tab);
  },
  { immediate: true },
);

watch(activeKey, (tab) => void syncLedgerTab(tab));
</script>

<template>
  <Page auto-content-height>
    <Spin :spinning="loading">
      <div class="enterprise-finance-page">
        <Card title="财税资料">
          <template #extra>
            <div class="enterprise-finance-page__actions">
              <Button @click="downloadFinanceTemplate">下载财税模板</Button>
              <label class="enterprise-finance-page__import"><Button :loading="importing">导入财税数据</Button><input accept=".csv,text/csv" type="file" @change="importFinanceTemplate" /></label>
              <Button @click="financeAiParseOpen = true">上传报表/审计 AI 解析</Button>
              <Button type="primary" @click="openEditor()">新增{{ currentTitle }}</Button>
            </div>
          </template>
          <Tabs v-model:active-key="activeKey"><TabPane key="financial" tab="财务数据" /><TabPane key="taxAudit" tab="纳税审计" /></Tabs>
          <Table v-if="currentRows.length" :columns="currentColumns" :data-source="currentRows" :pagination="false" :row-key="(item: FinanceItem) => item.id" :scroll="{ x: 1180 }">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'q'">{{ (record as EnterpriseWorkspaceFinancialRecord).q === 1 ? '全年' : (record as EnterpriseWorkspaceFinancialRecord).q || '-' }}</template>
              <template v-else-if="column.key === 'filePath'">{{ (record as EnterpriseWorkspaceTaxAudit).filePath ? '已上传' : '-' }}</template>
              <template v-else-if="column.key === 'actions'"><Button v-if="activeKey === 'taxAudit' && (record as EnterpriseWorkspaceTaxAudit).filePath" size="small" type="link" @click="download(record as EnterpriseWorkspaceTaxAudit)">下载附件</Button><Button size="small" type="link" @click="openEditor(record)">编辑</Button><Button danger size="small" type="link" @click="remove(record)">删除</Button></template>
            </template>
          </Table>
          <Empty v-else description="暂无记录" />
        </Card>
        <Modal v-model:open="editorOpen" :confirm-loading="saving" :title="editing ? `编辑${currentTitle}` : `新增${currentTitle}`" width="900px" @ok="save">
          <Form v-if="activeKey === 'financial'" :model="financialForm" layout="vertical">
            <section class="enterprise-finance-page__form-section"><h3>基础财务数据</h3><div class="enterprise-finance-page__grid"><FormItem label="年度" required><Input v-model:value="financialForm.year" /></FormItem><FormItem label="季度"><InputNumber v-model:value="financialForm.q" :max="4" :min="1" class="w-full" /></FormItem><FormItem label="销售收入"><Input v-model:value="financialForm.xxsr" /></FormItem><FormItem label="总收入"><Input v-model:value="financialForm.totalRevenue" /></FormItem><FormItem label="主营业务收入"><Input v-model:value="financialForm.mainBusinessIncome" /></FormItem><FormItem label="高新收入"><Input v-model:value="financialForm.highTechIncome" /></FormItem><FormItem label="总资产"><Input v-model:value="financialForm.zxc" /></FormItem><FormItem label="净资产"><Input v-model:value="financialForm.netAssets" /></FormItem><FormItem label="负债"><Input v-model:value="financialForm.fz" /></FormItem><FormItem label="负债率"><Input v-model:value="financialForm.fzl" /></FormItem><FormItem label="利润总额"><Input v-model:value="financialForm.lrTotal" /></FormItem><FormItem label="净利润"><Input v-model:value="financialForm.netProfit" /></FormItem><FormItem label="研发费用"><Input v-model:value="financialForm.rdExpense" /></FormItem></div></section>
            <section class="enterprise-finance-page__form-section"><h3>研发费用结构</h3><div class="enterprise-finance-page__grid"><FormItem label="人员人工"><Input v-model:value="financialForm.rdPersonnelCost" /></FormItem><FormItem label="直接投入"><Input v-model:value="financialForm.rdDirectInput" /></FormItem><FormItem label="折旧摊销"><Input v-model:value="financialForm.rdDepreciation" /></FormItem><FormItem label="无形资产摊销"><Input v-model:value="financialForm.rdIntangibleAmortization" /></FormItem><FormItem label="设计费"><Input v-model:value="financialForm.rdDesignFee" /></FormItem><FormItem label="装备调试费"><Input v-model:value="financialForm.rdEquipmentDebuggingFee" /></FormItem><FormItem label="委托研发"><Input v-model:value="financialForm.rdEntrustedDevelopment" /></FormItem><FormItem label="其他费用"><Input v-model:value="financialForm.rdOtherExpense" /></FormItem></div></section>
            <FormItem label="备注"><Input v-model:value="financialForm.remark" /></FormItem>
          </Form>
          <Form v-else :model="taxAuditForm" layout="vertical"><FormItem label="年度" required><Input v-model:value="taxAuditForm.year" /></FormItem><FormItem label="文件类型"><InputNumber v-model:value="taxAuditForm.fileClass" :max="3" :min="1" class="w-full" /></FormItem><FormItem label="税种/报告类别"><Input v-model:value="taxAuditForm.taxCategory" /></FormItem><FormItem label="审计附件"><input type="file" @change="upload" /><p v-if="taxAuditForm.filePath">文件已上传</p></FormItem><FormItem label="备注"><Input v-model:value="taxAuditForm.remark" /></FormItem></Form>
        </Modal>
        <Modal v-model:open="importResultOpen" :footer="null" :title="importResultTitle" width="720px"><p>{{ importResultDescription }}</p><Table v-if="importErrors.length" :columns="[{ dataIndex: 'rowNumber', title: '行号' }, { dataIndex: 'fieldName', title: '字段' }, { dataIndex: 'message', title: '错误说明' }, { dataIndex: 'suggestion', title: '修正建议' }]" :data-source="importErrors" :pagination="false" :row-key="(item: EnterpriseWorkspaceMaterialError) => item.id" size="small" /><Empty v-else description="未发现解析错误" /></Modal>
        <EnterpriseFinanceAiParseModal v-model:open="financeAiParseOpen" :enterprise-id="enterpriseId()" @approved="load" />
      </div>
    </Spin>
  </Page>
</template>

<style scoped>
.enterprise-finance-page { display: grid; gap: 16px; }
.enterprise-finance-page__actions { display: flex; flex-wrap: wrap; gap: 8px; }
.enterprise-finance-page__import input { display: none; }
.enterprise-finance-page__form-section { margin-bottom: 16px; }
.enterprise-finance-page__form-section h3 { margin: 0 0 8px; font-size: 14px; }
.enterprise-finance-page__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 16px; }
@media (max-width: 640px) { .enterprise-finance-page__grid { grid-template-columns: 1fr; } }
</style>
