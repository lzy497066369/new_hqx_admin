<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';
import { useRouter } from 'vue-router';

import {
  Button,
  Card,
  Empty,
  Input,
  Space,
  Tag,
  TypographyParagraph,
} from 'antdv-next';

import { getClientDeclareProjectsApi } from '#/api/client';
import type { ClientDeclareProjectApi } from '#/api/client';
import { useClientEnterpriseStore } from '#/store';

const store = useClientEnterpriseStore();
const router = useRouter();

const keyword = shallowRef('');
const loading = shallowRef(false);
const projects = shallowRef<ClientDeclareProjectApi.DeclareProject[]>([]);

const regionHint = computed(() => {
  const profile = store.enterpriseProfile;
  const parts = [
    profile?.province,
    profile?.city,
    profile?.district,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' / ') : '请先完善企业所在地区';
});

async function loadProjects() {
  loading.value = true;
  try {
    const result = await getClientDeclareProjectsApi({
      keyword: keyword.value || undefined,
      page: 1,
      pageSize: 100,
    });
    projects.value = result.items;
  } finally {
    loading.value = false;
  }
}

function openProjectDetail(project: ClientDeclareProjectApi.DeclareProject) {
  router.push(`/projects/detail/${project.id}`);
}

onMounted(loadProjects);
</script>

<template>
  <div class="client-project-list">
    <Card :bordered="false">
      <div class="client-project-list__summary">
        <div>
          <p class="client-project-list__eyebrow">
            {{ store.currentCompanyName || '当前企业' }}
          </p>
          <h1 class="client-project-list__title">申报项目</h1>
          <p class="client-project-list__description">
            根据企业所在省市区召回相关政策，再聚合为可申报项目。
          </p>
        </div>
        <div class="client-project-list__metric">
          <span>匹配地区</span>
          <strong>{{ regionHint }}</strong>
        </div>
        <div class="client-project-list__metric">
          <span>项目数量</span>
          <strong>{{ projects.length }}</strong>
        </div>
      </div>
    </Card>

    <Card :bordered="false" title="项目列表">
      <div class="client-project-list__toolbar">
        <Input.Search
          v-model:value="keyword"
          allow-clear
          placeholder="搜索项目、政策类型或地区"
          @search="loadProjects"
        />
        <Button :loading="loading" @click="loadProjects">刷新</Button>
      </div>

      <div v-if="loading" class="client-project-list__loading">
        正在加载项目...
      </div>
      <Empty v-else-if="projects.length === 0" description="暂无可申报项目" />
      <div v-else class="client-project-list__items">
        <div
          v-for="item in projects"
          :key="item.id"
          class="client-project-list__item"
        >
          <div class="client-project-list__item-main">
            <div class="client-project-list__item-title">
              <span>{{ item.name }}</span>
              <Tag color="blue">{{ item.policyType || '政策项目' }}</Tag>
            </div>
            <Space wrap>
              <Tag color="green">
                命中 {{ item.matchedPolicyCount }} 条政策
              </Tag>
              <Tag v-if="item.nearestDeadline" color="orange">
                截止 {{ item.nearestDeadline }}
              </Tag>
              <Tag v-if="item.subsidyText" color="red">
                奖补 {{ item.subsidyText }}
              </Tag>
              <Tag v-for="regionName in item.regionNames" :key="regionName">
                {{ regionName }}
              </Tag>
            </Space>
            <TypographyParagraph
              :ellipsis="{ rows: 2 }"
              class="client-project-list__desc"
            >
              {{ item.basicDescription || item.applicableObjects || '暂无项目说明' }}
            </TypographyParagraph>
          </div>
          <Button
            type="primary"
            @click="openProjectDetail(item)"
          >
            查看详情
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.client-project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.client-project-list__summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 16px;
  align-items: stretch;
}

.client-project-list__eyebrow,
.client-project-list__description {
  margin: 0;
  color: rgb(0 0 0 / 45%);
}

.client-project-list__title {
  margin: 6px 0;
  font-size: 24px;
  font-weight: 600;
}

.client-project-list__metric {
  min-width: 150px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
}

.client-project-list__metric span {
  display: block;
  margin-bottom: 4px;
  color: rgb(0 0 0 / 45%);
}

.client-project-list__toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.client-project-list__item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.client-project-list__item-main {
  min-width: 0;
  flex: 1;
}

.client-project-list__loading {
  padding: 40px 0;
  color: rgb(0 0 0 / 45%);
  text-align: center;
}

.client-project-list__item-title {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.client-project-list__desc {
  margin-top: 12px;
  white-space: pre-wrap;
}

@media (max-width: 900px) {
  .client-project-list__summary {
    grid-template-columns: 1fr;
  }

  .client-project-list__toolbar,
  .client-project-list__item {
    flex-direction: column;
  }
}
</style>
