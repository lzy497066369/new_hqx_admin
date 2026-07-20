<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { useRouter } from 'vue-router';

import { Card, Empty, Spin, message } from 'antdv-next';

import { reviewEnterpriseWorkspaceDeclarationApi } from '#/api';
import { useEnterpriseContextStore } from '#/store';

import EnterpriseDeclarationList from './components/EnterpriseDeclarationList.vue';
import EnterpriseOperationList from './components/EnterpriseOperationList.vue';
import EnterpriseOverviewHeader from './components/EnterpriseOverviewHeader.vue';
import EnterpriseRiskList from './components/EnterpriseRiskList.vue';
import type { EnterpriseRiskTarget } from './components/enterprise-risk-target';
import { useEnterpriseWorkspace } from './composables/use-enterprise-workspace';

defineOptions({ name: 'EnterpriseWorkspace' });

const { backToEnterpriseList, enterpriseId, loading, refresh, summary } =
  useEnterpriseWorkspace();
const router = useRouter();
const enterpriseContextStore = useEnterpriseContextStore();

async function openProfile() {
  await openMaterialLedger('basic');
}

async function openFinance() {
  await openMaterialLedger('finance');
}

async function openEmployees() {
  await openMaterialLedger('employee');
}
async function openProperties() {
  await openMaterialLedger('intellectual_property');
}

async function openEvidenceChain() {
  if (!summary.value) return;
  await router.push({
    name: 'EnterpriseWorkspaceEvidenceChain',
    params: { enterpriseId: summary.value.profile.id },
  });
}

async function openArchiveRecords() {
  await openMaterialLedger('contract');
}

async function openDeclarations() {
  if (!summary.value) return;
  await router.push({
    name: 'EnterpriseDeclarationList',
    query: { enterpriseId: summary.value.profile.id },
  });
}

async function openMaterialLedger(section: string) {
  if (!summary.value) return;
  enterpriseContextStore.setCurrentEnterprise(summary.value.profile.id);
  await router.push({
    name: 'EnterpriseMaterialSection',
    params: { section },
  });
}

async function openRiskTarget(target: EnterpriseRiskTarget) {
  if (!summary.value) return;
  if (target.type === 'declarations') {
    if (target.declarationId) {
      await router.push({
        name: 'EnterpriseDeclarationDetail',
        params: {
          declarationId: target.declarationId,
          enterpriseId: summary.value.profile.id,
        },
      });
      return;
    }
    await openDeclarations();
    return;
  }
  enterpriseContextStore.setCurrentEnterprise(summary.value.profile.id);
  if (target.tab) enterpriseContextStore.setMaterialLedgerTab(target.section, target.tab);
  await router.push({
    name: 'EnterpriseMaterialSection',
    params: { section: target.section },
  });
}

async function openTodos() {
  if (!summary.value) return;
  await router.push({ name: 'EnterpriseWorkspaceTodos', params: { enterpriseId: summary.value.profile.id } });
}

async function reviewDeclaration(payload: {
  action: 'approve' | 'return';
  declarationId: string;
}) {
  if (!enterpriseId.value) return;
  try {
    await reviewEnterpriseWorkspaceDeclarationApi(
      enterpriseId.value,
      payload.declarationId,
      { action: payload.action },
    );
    message.success(payload.action === 'approve' ? '申报已通过审核' : '申报已退回补资料');
    await refresh();
  } catch (error) {
    message.error(error instanceof Error ? error.message : '处理申报审核失败');
  }
}
</script>

<template>
  <Page auto-content-height>
    <Spin :spinning="loading">
      <div v-if="summary" class="enterprise-workspace">
        <EnterpriseOverviewHeader
          :metrics="summary.metrics"
          :profile="summary.profile"
          @back="backToEnterpriseList"
          @manage-profile="openProfile"
          @manage-finance="openFinance"
          @manage-employees="openEmployees"
          @manage-properties="openProperties"
          @manage-evidence-chain="openEvidenceChain"
          @manage-archive-records="openArchiveRecords"
          @manage-declarations="openDeclarations"
          @manage-todos="openTodos"
          @refresh="refresh"
        />

        <div class="enterprise-workspace__grid enterprise-workspace__grid--primary">
          <Card title="风险与待办">
            <EnterpriseRiskList :risks="summary.risks" @open="openRiskTarget" />
          </Card>
          <Card title="最近操作">
            <EnterpriseOperationList :operations="summary.recentOperations" />
          </Card>
        </div>

        <Card title="近期申报">
          <EnterpriseDeclarationList
            :declarations="summary.declarations"
            @review="reviewDeclaration"
          />
        </Card>
      </div>
      <Empty v-else-if="!loading" description="未找到可访问的企业工作台" />
    </Spin>
  </Page>
</template>

<style scoped>
.enterprise-workspace {
  display: grid;
  gap: 16px;
}

.enterprise-workspace__grid {
  display: grid;
  gap: 16px;
}

.enterprise-workspace__grid--primary {
  grid-template-columns: minmax(0, 1.3fr) minmax(300px, 0.7fr);
}

@media (max-width: 960px) {
  .enterprise-workspace__grid--primary {
    grid-template-columns: 1fr;
  }
}
</style>
