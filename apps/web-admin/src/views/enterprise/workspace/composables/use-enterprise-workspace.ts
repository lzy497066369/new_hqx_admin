import { computed, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  getEnterpriseWorkspaceSummaryApi,
  type EnterpriseWorkspaceSummary,
} from '#/api';
import { useEnterpriseContextStore } from '#/store';

export function useEnterpriseWorkspace() {
  const route = useRoute();
  const router = useRouter();
  const enterpriseContextStore = useEnterpriseContextStore();
  const loading = shallowRef(false);
  const summary = shallowRef<EnterpriseWorkspaceSummary>();

  const enterpriseId = computed(() => String(route.params.enterpriseId ?? ''));

  async function refresh() {
    if (!enterpriseId.value) {
      summary.value = undefined;
      return;
    }

    loading.value = true;
    try {
      summary.value = await getEnterpriseWorkspaceSummaryApi(enterpriseId.value);
      enterpriseContextStore.setCurrentEnterprise({
        id: enterpriseId.value,
        name: summary.value.profile.name,
      });
    } finally {
      loading.value = false;
    }
  }

  async function backToEnterpriseList() {
    await router.push({ name: 'EnterpriseProfileList' });
  }

  watch(enterpriseId, (currentEnterpriseId) => {
    if (currentEnterpriseId) {
      enterpriseContextStore.setCurrentEnterprise(currentEnterpriseId);
    }
    void refresh();
  }, { immediate: true });

  return {
    backToEnterpriseList,
    enterpriseId,
    loading,
    refresh,
    summary,
  };
}
