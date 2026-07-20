<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Alert, Button, Card, Empty, Skeleton, Tag } from 'antdv-next';

import { useCollaborationCenter } from '#/layouts/composables/use-collaboration-center';
import { useClientEnterpriseStore } from '#/store';

defineOptions({ name: 'ClientHome' });

const router = useRouter();
const store = useClientEnterpriseStore();
const collaborationCenter = useCollaborationCenter();

const profileStatusMap: Record<string, { color: string; label: string }> = {
  checking: { color: 'processing', label: '校验中' },
  draft: { color: 'default', label: '待完善' },
  invalid: { color: 'warning', label: '需补正' },
  valid: { color: 'success', label: '已通过' },
};

const profileStatus = computed(() => {
  const status =
    store.enterpriseProfile?.profileStatus ??
    store.currentCompany?.profileStatus ??
    'draft';

  return (
    profileStatusMap[status] ?? {
      color: 'default',
      label: status || '待完善',
    }
  );
});

const profileChecks = computed(() => {
  const profile = store.enterpriseProfile;

  return [
    { done: Boolean(profile?.name), label: '企业名称' },
    { done: Boolean(profile?.creditCode), label: '统一社会信用代码' },
    { done: Boolean(profile?.contactName), label: '联系人' },
    { done: Boolean(profile?.contactPhone), label: '联系电话' },
  ];
});

const doneCount = computed(
  () => profileChecks.value.filter((item) => item.done).length,
);

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

const currentCompanySubtitle = computed(() => {
  const company = store.currentCompany;
  if (!company) {
    return '当前账号暂未绑定企业';
  }

  return company.shortName || company.creditCode || '企业上下文已就绪';
});

onMounted(() => {
  if (!store.initialized) {
    store.refreshContext().catch(() => {});
  }
});

function navTo(name: string) {
  router.push({ name });
}

function navToPath(path: string) {
  router.push(path).catch(() => {});
}
</script>

<template>
  <Page auto-content-height>
    <div class="space-y-5 p-5">
      <Alert
        v-if="store.errorMessage"
        show-icon
        type="warning"
        :message="store.errorMessage"
      />

      <Skeleton v-if="store.loading && !store.initialized" active />

      <template v-else>
        <div class="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div class="text-sm text-foreground/60">当前企业</div>
              <div class="mt-2 text-2xl font-semibold text-foreground">
                {{ store.currentCompanyName || '未选择企业' }}
              </div>
              <div class="mt-1 text-sm text-foreground/60">
                {{ currentCompanySubtitle }}
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <Button @click="store.refreshContext()">
                <IconifyIcon icon="lucide:refresh-cw" class="size-4" />
                刷新
              </Button>
              <Button type="primary" @click="navTo('ClientCompanySwitch')">
                <IconifyIcon icon="lucide:repeat-2" class="size-4" />
                切换公司
              </Button>
            </div>
          </div>
        </div>

        <Empty
          v-if="!store.hasCompanies"
          description="当前账号还没有可访问企业"
        />

        <template v-else>
          <div class="grid gap-4 md:grid-cols-3">
            <Card variant="borderless">
              <div class="text-sm text-foreground/60">资料状态</div>
              <div class="mt-3 flex items-center gap-2">
                <Tag :color="profileStatus.color">{{ profileStatus.label }}</Tag>
                <span class="text-sm text-foreground/60">
                  {{ doneCount }}/{{ profileChecks.length }} 项基础信息
                </span>
              </div>
            </Card>

            <Card variant="borderless">
              <div class="text-sm text-foreground/60">可操作企业</div>
              <div class="mt-2 text-3xl font-semibold">
                {{ store.companies.length }}
              </div>
            </Card>

            <Card variant="borderless">
              <div class="text-sm text-foreground/60">经办身份</div>
              <div class="mt-2 text-lg font-medium">
                {{ store.me?.roleInCompany || store.currentCompany?.roleName || '-' }}
              </div>
            </Card>
          </div>

          <div class="grid gap-4 lg:grid-cols-2">
            <Card title="待补全项" variant="borderless">
              <div class="space-y-3">
                <div
                  v-for="item in profileChecks"
                  :key="item.label"
                  class="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <span>{{ item.label }}</span>
                  <Tag :color="item.done ? 'success' : 'warning'">
                    {{ item.done ? '已填写' : '待补全' }}
                  </Tag>
                </div>
              </div>
            </Card>

            <Card title="快捷入口" variant="borderless">
              <div class="grid gap-3 sm:grid-cols-2">
                <Button block @click="navTo('ClientProfile')">
                  <IconifyIcon icon="lucide:user-round" class="size-4" />
                  个人情况
                </Button>
                <Button block @click="navTo('ClientCompany')">
                  <IconifyIcon icon="lucide:building-2" class="size-4" />
                  公司资料
                </Button>
                <Button block @click="navTo('ClientCompanySwitch')">
                  <IconifyIcon icon="lucide:repeat-2" class="size-4" />
                  公司切换
                </Button>
                <Button block @click="navTo('ClientCompanyMaterials')">
                  <IconifyIcon icon="lucide:images" class="size-4" />
                  企业资料图库
                </Button>
              </div>
            </Card>
          </div>

          <div class="grid gap-4 lg:grid-cols-2">
            <Card title="通知中心" variant="borderless">
              <div
                v-if="collaborationCenter.notifications.value.length"
                class="space-y-3"
              >
                <button
                  v-for="item in collaborationCenter.notifications.value.slice(0, 4)"
                  :key="item.id"
                  class="flex w-full items-center justify-between gap-3 rounded-md border border-border px-3 py-3 text-left"
                  type="button"
                  @click="item.link && navToPath(item.link)"
                >
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <Tag
                        :color="notificationColor(item.isRead ? 'low' : 'medium')"
                      >
                        {{ item.isRead ? '已读' : '待处理' }}
                      </Tag>
                      <span class="font-medium">{{ item.title }}</span>
                    </div>
                    <div class="mt-1 line-clamp-2 text-sm text-foreground/60">
                      {{ item.message }}
                    </div>
                    <div class="mt-2 text-xs text-foreground/50">{{ item.date }}</div>
                  </div>
                </button>
              </div>
              <Empty v-else description="当前企业暂无新的提醒" />
            </Card>

            <Card title="同步中心" variant="borderless">
              <div v-if="collaborationCenter.syncItems.value.length" class="space-y-3">
                <button
                  v-for="item in collaborationCenter.syncItems.value.slice(0, 4)"
                  :key="item.id"
                  class="flex w-full items-center justify-between gap-3 rounded-md border border-border px-3 py-3 text-left"
                  type="button"
                  @click="item.link && navToPath(item.link)"
                >
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <Tag :color="syncStatusColor(item.status)">
                        {{ item.status === 'failed' ? '失败' : item.status === 'running' ? '进行中' : '已完成' }}
                      </Tag>
                      <span class="font-medium">{{ item.title }}</span>
                    </div>
                    <div class="mt-1 line-clamp-2 text-sm text-foreground/60">
                      {{ item.description }}
                    </div>
                    <div class="mt-2 text-xs text-foreground/50">
                      {{ item.currentStep || '等待处理' }} · {{ item.time }}
                    </div>
                  </div>
                </button>
              </div>
              <Empty v-else description="当前没有进行中的同步任务" />
            </Card>
          </div>
        </template>
      </template>
    </div>
  </Page>
</template>
