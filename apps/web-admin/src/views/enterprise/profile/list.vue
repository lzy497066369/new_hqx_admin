<script setup lang="ts">
import type { EnterpriseProfileItem } from '#/api';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { onMounted, shallowRef, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

import { Card } from 'antdv-next';

import { getEnterpriseProfileDetailApi, getEnterpriseProfilesApi } from '#/api';
import { useEnterpriseContextStore } from '#/store';
import { showActionFailure } from '../../system/shared/action-feedback';

import EnterpriseCardFilters from './components/EnterpriseCardFilters.vue';
import EnterpriseCardList from './components/EnterpriseCardList.vue';
import type { EnterpriseCardFiltersValue } from './components/types';
import EnterpriseWorkspaceOverview from './components/EnterpriseWorkspaceOverview.vue';
import AccountManager from './modules/account-manager.vue';
import Detail from './modules/detail.vue';
import Form from './modules/form.vue';

defineOptions({ name: 'EnterpriseProfileList' });

const router = useRouter();
const enterpriseContextStore = useEnterpriseContextStore();
const workspaceOverviewRef =
  useTemplateRef<InstanceType<typeof EnterpriseWorkspaceOverview>>(
    'workspaceOverview',
  );
const filters = shallowRef<EnterpriseCardFiltersValue>({});
const items = shallowRef<EnterpriseProfileItem[]>([]);
const loading = shallowRef(false);
const page = shallowRef(1);
const pageSize = shallowRef(12);
const total = shallowRef(0);

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  connectedComponent: Detail,
  destroyOnClose: true,
});
const [AccountManagerDrawer, accountManagerDrawerApi] = useVbenDrawer({
  connectedComponent: AccountManager,
  destroyOnClose: true,
});

async function load() {
  loading.value = true;
  try {
    const result = await getEnterpriseProfilesApi({
      ...filters.value,
      page: page.value,
      pageSize: pageSize.value,
    });
    items.value = result.items;
    total.value = result.total;
  } catch (error) {
    showActionFailure(error);
  } finally {
    loading.value = false;
  }
}

function search() {
  page.value = 1;
  void load();
}

function reset() {
  filters.value = {};
  search();
}

function changePage(nextPage: number, nextPageSize: number) {
  page.value = nextPage;
  pageSize.value = nextPageSize;
  void load();
}

async function openEdit(row: EnterpriseProfileItem) {
  try {
    formModalApi.setData(await getEnterpriseProfileDetailApi(row.id)).open();
  } catch (error) {
    showActionFailure(error);
  }
}

async function openDetail(row: EnterpriseProfileItem) {
  try {
    detailDrawerApi.setData(await getEnterpriseProfileDetailApi(row.id)).open();
  } catch (error) {
    showActionFailure(error);
  }
}

async function openDeclarations(row: EnterpriseProfileItem) {
  enterpriseContextStore.setCurrentEnterprise({ id: row.id, name: row.name });
  await router.push({
    name: 'EnterpriseDeclarationList',
    query: { enterpriseId: row.id },
  });
}

async function openDeclarationOverview(filters: {
  deadlineWithinDays?: number;
  missingMaterials?: boolean;
  status?: string;
}) {
  await router.push({
    name: 'EnterpriseDeclarationList',
    query: {
      deadlineWithinDays: filters.deadlineWithinDays,
      missingMaterials: filters.missingMaterials ? '1' : undefined,
      status: filters.status,
    },
  });
}

function openProfileOverview(nextFilters: { incomplete: '1' }) {
  page.value = 1;
  filters.value = nextFilters;
  void load();
}

function openAccountManager(row: EnterpriseProfileItem) {
  accountManagerDrawerApi.setData(row).open();
}

onMounted(() => {
  void load();
  void workspaceOverviewRef.value?.refresh();
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="search" />
    <DetailDrawer />
    <AccountManagerDrawer />
    <div class="enterprise-profile-page">
      <EnterpriseWorkspaceOverview
        ref="workspaceOverview"
        @open-declarations="openDeclarationOverview"
        @open-profiles="openProfileOverview"
      />
      <Card>
        <template #title>企业列表</template>
        <EnterpriseCardFilters
          v-model:filters="filters"
          @reset="reset"
          @search="search"
        />
      </Card>
      <EnterpriseCardList
        :items="items"
        :loading="loading"
        :page="page"
        :page-size="pageSize"
        :total="total"
        @accounts="openAccountManager"
        @change-page="changePage"
        @detail="openDetail"
        @declarations="openDeclarations"
        @edit="openEdit"
      />
    </div>
  </Page>
</template>

<style scoped>
.enterprise-profile-page {
  display: grid;
  gap: 16px;
}
</style>
