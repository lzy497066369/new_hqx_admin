<script setup lang="ts">
import type { EnterpriseProfileItem, EnterpriseWorkspaceSummary } from '#/api';

import { ArrowLeft, RotateCw } from '@vben/icons';

import { Button, Tag } from 'antdv-next';

interface Props {
  metrics: EnterpriseWorkspaceSummary['metrics'];
  profile: EnterpriseProfileItem;
}

defineProps<Props>();

const emit = defineEmits<{
  back: [];
  manageProfile: [];
  manageFinance: [];
  manageEmployees: [];
  manageEvidenceChain: [];
  manageArchiveRecords: [];
  manageDeclarations: [];
  manageTodos: [];
  manageProperties: [];
  refresh: [];
}>();

function getProfileStatusLabel(status: string) {
  const labels: Record<string, string> = {
    completed: '已完成',
    draft: '待完善',
    pending: '待确认',
  };
  return labels[status] ?? status;
}
</script>

<template>
  <section class="enterprise-overview-header">
    <div class="enterprise-overview-header__topline">
      <Button type="text" @click="emit('back')">
        <ArrowLeft class="size-4" />
        返回企业列表
      </Button>
      <Button @click="emit('refresh')">
        <RotateCw class="size-4" />
        刷新数据
      </Button>
      <Button type="primary" @click="emit('manageProfile')">
        维护企业资料
      </Button>
      <Button @click="emit('manageFinance')">查看财税资料</Button>
      <Button @click="emit('manageEmployees')">查看人员资料</Button>
      <Button @click="emit('manageProperties')">查看知识产权</Button>
      <Button @click="emit('manageEvidenceChain')">查看证据链</Button>
      <Button @click="emit('manageArchiveRecords')">维护档案资料</Button>
      <Button @click="emit('manageDeclarations')">进入申报工作台</Button>
      <Button @click="emit('manageTodos')">查看协同待办</Button>
    </div>

    <div class="enterprise-overview-header__main">
      <div>
        <div class="enterprise-overview-header__title-row">
          <h1 class="enterprise-overview-header__title">{{ profile.name }}</h1>
          <Tag :color="profile.status === 1 ? 'green' : 'default'">
            {{ profile.status === 1 ? '正常' : '停用' }}
          </Tag>
          <Tag color="blue">{{ getProfileStatusLabel(profile.profileStatus) }}</Tag>
        </div>
        <p class="enterprise-overview-header__meta">
          {{ profile.creditCode }}
          <span v-if="profile.industry">{{ profile.industry }}</span>
          <span v-if="profile.city || profile.province">
            {{ [profile.province, profile.city, profile.district].filter(Boolean).join('') }}
          </span>
        </p>
      </div>

      <div class="enterprise-overview-header__metrics">
        <div class="enterprise-overview-header__metric">
          <span>资料完整度</span>
          <strong>{{ metrics.completenessRate.toFixed(0) }}%</strong>
          <small>{{ metrics.completedModules }}/{{ metrics.totalModules }} 个资料域</small>
        </div>
        <div class="enterprise-overview-header__metric">
          <span>健康评分</span>
          <strong>{{ metrics.healthScore.toFixed(0) }}</strong>
          <small>基于现有资料统计</small>
        </div>
        <div class="enterprise-overview-header__metric">
          <span>进行中申报</span>
          <strong>{{ metrics.activeDeclarations }}</strong>
          <small>{{ metrics.attachmentRecords }} 份附件记录</small>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.enterprise-overview-header {
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.enterprise-overview-header__topline {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 22px;
}

.enterprise-overview-header__main {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.enterprise-overview-header__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.enterprise-overview-header__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0;
  color: #111827;
}

.enterprise-overview-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #6b7280;
}

.enterprise-overview-header__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(112px, 1fr));
  border-left: 1px solid #e5e7eb;
}

.enterprise-overview-header__metric {
  display: grid;
  gap: 4px;
  min-width: 120px;
  padding: 0 18px;
}

.enterprise-overview-header__metric + .enterprise-overview-header__metric {
  border-left: 1px solid #e5e7eb;
}

.enterprise-overview-header__metric span,
.enterprise-overview-header__metric small {
  font-size: 12px;
  line-height: 1.4;
  color: #6b7280;
}

.enterprise-overview-header__metric strong {
  font-size: 24px;
  line-height: 1.1;
  color: #111827;
}

@media (max-width: 960px) {
  .enterprise-overview-header__main {
    align-items: stretch;
    flex-direction: column;
  }

  .enterprise-overview-header__metrics {
    border-top: 1px solid #e5e7eb;
    border-left: 0;
    padding-top: 16px;
  }

  .enterprise-overview-header__metric:first-child {
    padding-left: 0;
  }
}

@media (max-width: 640px) {
  .enterprise-overview-header {
    padding: 16px;
  }

  .enterprise-overview-header__metrics {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .enterprise-overview-header__metric,
  .enterprise-overview-header__metric + .enterprise-overview-header__metric {
    padding: 0;
    border-left: 0;
  }
}
</style>
