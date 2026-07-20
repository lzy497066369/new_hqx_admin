<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Alert, Button, Card, Empty, Progress, Skeleton, Tag } from 'antdv-next';

import { useClientDashboardData } from '../composables/use-client-dashboard-data';

const router = useRouter();
const userStore = useUserStore();
const dashboard = useClientDashboardData();

const workbench = computed(() => dashboard.workbench.value);
const syncSummary = computed(() => workbench.value?.syncSummary);
const todayLabel = computed(() =>
  new Date().toLocaleDateString('zh-CN', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  }),
);

const priorityColor: Record<string, string> = {
  high: 'error',
  low: 'default',
  medium: 'warning',
};

function notificationColor(level: 'high' | 'medium' | 'low') {
  if (level === 'high') return 'red';
  if (level === 'medium') return 'orange';
  return 'blue';
}

function syncStatusColor(status: string) {
  if (status === 'failed') return 'red';
  if (status === 'running') return 'processing';
  return 'green';
}

onMounted(() => {
  dashboard.loadWorkbench();
});

function navTo(path: string) {
  router.push(path).catch(() => {});
}
</script>

<template>
  <Page auto-content-height>
    <div class="client-workspace p-5">
      <Alert
        v-if="dashboard.errorMessage.value"
        class="mb-4"
        show-icon
        type="warning"
        :message="dashboard.errorMessage.value"
      />

      <Skeleton v-if="dashboard.loading.value" active />

      <template v-else-if="workbench">
        <section class="client-workspace__hero">
          <div class="flex min-w-0 flex-1 items-center gap-4">
            <img
              class="size-14 rounded-full border border-white/70 bg-white"
              :src="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
              alt=""
            />
            <div class="min-w-0">
              <div class="text-sm font-medium text-teal-700">{{ todayLabel }}</div>
              <h1 class="mt-1 truncate text-2xl font-semibold text-slate-950">
                {{ dashboard.companyName.value }}
              </h1>
              <p class="mt-1 text-sm text-slate-600">
                聚焦资料完善、材料上传和申报推进，数据均来自当前企业。
              </p>
            </div>
          </div>
          <Button @click="dashboard.loadWorkbench()">
            <IconifyIcon icon="lucide:refresh-cw" class="size-4" />
            刷新
          </Button>
        </section>

        <div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card v-for="card in workbench.overview" :key="card.key" variant="borderless">
            <div class="text-sm text-slate-500">{{ card.label }}</div>
            <div class="mt-2 text-3xl font-semibold text-slate-950">
              {{ card.value }}
            </div>
            <div class="mt-1 line-clamp-2 text-xs text-slate-500">
              {{ card.hint }}
            </div>
          </Card>
        </div>

        <div class="mt-5 grid gap-5 xl:grid-cols-[0.85fr_0.575fr_0.575fr]">
          <Card title="快捷入口" variant="borderless">
            <div class="grid gap-3 sm:grid-cols-2">
              <button
                v-for="entry in workbench.quickEntries"
                :key="entry.path"
                class="client-workspace__entry"
                type="button"
                @click="navTo(entry.path)"
              >
                <IconifyIcon :icon="entry.icon" class="size-5 text-teal-700" />
                <span>{{ entry.label }}</span>
              </button>
            </div>
          </Card>

          <Card title="通知中心" variant="borderless">
            <div
              v-if="workbench.notificationSummary.items.length"
              class="grid gap-3"
            >
              <button
                v-for="notice in workbench.notificationSummary.items"
                :key="notice.id"
                class="client-workspace__notice"
                type="button"
                @click="navTo(notice.actionPath)"
              >
                <div class="min-w-0 text-left">
                  <div class="flex flex-wrap items-center gap-2">
                    <Tag :color="notificationColor(notice.level)">
                      {{ notice.level === 'high' ? '高优先级' : notice.level === 'medium' ? '处理中' : '提醒' }}
                    </Tag>
                    <span class="font-medium text-slate-900">{{ notice.title }}</span>
                  </div>
                  <p class="mt-1 line-clamp-2 text-sm text-slate-500">
                    {{ notice.content }}
                  </p>
                  <div class="mt-2 text-xs text-slate-400">{{ notice.time }}</div>
                </div>
                <span class="text-sm font-medium text-teal-700">
                  {{ notice.actionText }}
                </span>
              </button>
            </div>
            <div v-else class="client-workspace__notice">
              <div>
                <div class="text-base font-medium text-slate-900">暂无新的资料提醒</div>
                <p class="mt-1 text-sm text-slate-500">
                  {{ workbench.notificationSummary.description }}
                </p>
              </div>
              <Tag color="cyan">{{ workbench.notificationSummary.unread }} 条未读</Tag>
            </div>
          </Card>

          <Card title="同步中心" variant="borderless">
            <div v-if="syncSummary?.items.length" class="grid gap-3">
              <button
                v-for="item in syncSummary.items"
                :key="item.id"
                class="client-workspace__notice"
                type="button"
                @click="navTo(item.actionPath)"
              >
                <div class="min-w-0 text-left">
                  <div class="flex flex-wrap items-center gap-2">
                    <Tag :color="syncStatusColor(item.status)">
                      {{ item.status === 'failed' ? '失败' : item.status === 'running' ? '进行中' : '已完成' }}
                    </Tag>
                    <span class="font-medium text-slate-900">{{ item.title }}</span>
                  </div>
                  <p class="mt-1 line-clamp-2 text-sm text-slate-500">
                    {{ item.description }}
                  </p>
                  <div class="mt-2 text-xs text-slate-400">
                    {{ item.currentStep || '等待处理' }} · {{ item.time }}
                  </div>
                </div>
              </button>
            </div>
            <div v-else class="client-workspace__notice">
              <div>
                <div class="text-base font-medium text-slate-900">暂无进行中的同步任务</div>
                <p class="mt-1 text-sm text-slate-500">
                  {{ syncSummary?.description || '当前没有等待系统校验的企业材料。' }}
                </p>
              </div>
              <Tag color="default">0 个运行中</Tag>
            </div>
          </Card>
        </div>

        <div class="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
          <Card title="工作进度" variant="borderless">
            <div class="space-y-5">
              <div v-for="item in workbench.workProgress" :key="item.key">
                <div class="mb-2 flex items-center justify-between text-sm">
                  <span class="text-slate-700">{{ item.label }}</span>
                  <span class="font-medium text-slate-950">{{ item.value }}</span>
                </div>
                <Progress :percent="item.percent" />
              </div>
            </div>
          </Card>

          <Card title="待处理事项" variant="borderless">
            <Empty v-if="workbench.todoPreview.length === 0" description="暂无待办事项" />
            <div v-else class="space-y-3">
              <button
                v-for="todo in workbench.todoPreview"
                :key="todo.key"
                class="client-workspace__todo"
                type="button"
                @click="navTo(todo.routePath)"
              >
                <div class="min-w-0 flex-1 text-left">
                  <div class="flex flex-wrap items-center gap-2">
                    <Tag :color="priorityColor[todo.priority]">{{ todo.source }}</Tag>
                    <span class="font-medium text-slate-900">{{ todo.title }}</span>
                  </div>
                  <div class="mt-1 line-clamp-2 text-sm text-slate-500">
                    {{ todo.description }}
                  </div>
                </div>
                <span class="text-sm font-medium text-teal-700">
                  {{ todo.actionText }}
                </span>
              </button>
            </div>
          </Card>
        </div>
      </template>
    </div>
  </Page>
</template>

<style scoped>
.client-workspace {
  min-height: 100%;
  background: linear-gradient(180deg, rgb(248 250 252) 0%, rgb(241 245 249) 100%);
}

.client-workspace__hero {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  border: 1px solid rgb(226 232 240);
  border-radius: 8px;
}

.client-workspace__entry,
.client-workspace__todo,
.client-workspace__notice {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px;
  background: #fff;
  border: 1px solid rgb(226 232 240);
  border-radius: 8px;
}

.client-workspace__entry {
  justify-content: flex-start;
  min-height: 56px;
  font-weight: 500;
}

.client-workspace__entry:hover,
.client-workspace__todo:hover {
  border-color: rgb(20 184 166 / 45%);
  box-shadow: 0 10px 26px rgb(15 23 42 / 8%);
}

@media (max-width: 640px) {
  .client-workspace__hero,
  .client-workspace__todo,
  .client-workspace__notice {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
