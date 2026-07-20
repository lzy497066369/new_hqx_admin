import type { NotificationItem, SyncStatusItem } from '@vben/layouts';

import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue';

import { useStorage } from '@vueuse/core';

import {
  getClientDashboardWorkbenchApi,
  type ClientDashboardApi,
} from '#/api/client';

const POLL_INTERVAL_MS = 60_000;

export function useCollaborationCenter() {
  const workbench = shallowRef<ClientDashboardApi.Workbench>();
  const loading = shallowRef(false);
  const readNotificationIds = useStorage<string[]>(
    'client-collaboration-read-notification-ids',
    [],
  );
  const removedNotificationIds = useStorage<string[]>(
    'client-collaboration-removed-notification-ids',
    [],
  );
  let timer: null | ReturnType<typeof setInterval> = null;

  const notificationEntries = computed(() =>
    (workbench.value?.notificationSummary.items ?? []).filter(
      (item) => !removedNotificationIds.value.includes(item.id),
    ),
  );

  const notifications = computed<NotificationItem[]>(() =>
    notificationEntries.value.map((item) => ({
      actionText: item.actionText,
      avatar: createAvatar(item.title.slice(0, 1), colorByLevel(item.level)),
      date: '',
      id: item.id,
      isRead: readNotificationIds.value.includes(item.id),
      level: item.level,
      link: item.actionPath,
      message: item.content,
      metaText: item.time,
      title: item.title,
    })),
  );

  const syncItems = computed<SyncStatusItem[]>(() =>
    (workbench.value?.syncSummary.items ?? []).map((item) => ({
      currentStep: item.currentStep,
      description: item.description,
      id: item.id,
      link: item.actionPath,
      progress: item.progress,
      status: item.status,
      time: item.time,
      title: item.title,
    })),
  );

  const syncFailed = computed(() => workbench.value?.syncSummary.failed ?? 0);
  const syncDescription = computed(
    () => workbench.value?.syncSummary.description ?? '',
  );
  const syncRunning = computed(() => workbench.value?.syncSummary.running ?? 0);
  const notificationDescription = computed(
    () => workbench.value?.notificationSummary.description ?? '',
  );
  const notificationUnread = computed(
    () => workbench.value?.notificationSummary.unread ?? 0,
  );

  async function load(silent = false) {
    if (!silent) {
      loading.value = true;
    }
    try {
      workbench.value = await getClientDashboardWorkbenchApi();
    } finally {
      if (!silent) {
        loading.value = false;
      }
    }
  }

  function markNotificationRead(id: number | string) {
    const nextId = String(id);
    if (readNotificationIds.value.includes(nextId)) {
      return;
    }
    readNotificationIds.value = [...readNotificationIds.value, nextId];
  }

  function markAllNotificationsRead() {
    readNotificationIds.value = [
      ...new Set([
        ...readNotificationIds.value,
        ...notificationEntries.value.map((item) => item.id),
      ]),
    ];
  }

  function clearNotifications() {
    markAllNotificationsRead();
    removedNotificationIds.value = [
      ...new Set([
        ...removedNotificationIds.value,
        ...notificationEntries.value.map((item) => item.id),
      ]),
    ];
  }

  function removeNotification(id: number | string) {
    const nextId = String(id);
    if (removedNotificationIds.value.includes(nextId)) {
      return;
    }
    removedNotificationIds.value = [...removedNotificationIds.value, nextId];
  }

  onMounted(() => {
    void load();
    timer = setInterval(() => {
      void load(true);
    }, POLL_INTERVAL_MS);
  });

  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });

  return {
    clearNotifications,
    load,
    loading,
    markAllNotificationsRead,
    markNotificationRead,
    notificationDescription,
    notificationUnread,
    notifications,
    removeNotification,
    syncDescription,
    syncFailed,
    syncItems,
    syncRunning,
  };
}

function colorByLevel(level: 'high' | 'low' | 'medium') {
  if (level === 'high') {
    return '#dc2626';
  }
  if (level === 'medium') {
    return '#d97706';
  }
  return '#0f766e';
}

function createAvatar(label: string, backgroundColor: string) {
  const safeLabel = (label || '待').slice(0, 1);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">` +
    `<rect width="80" height="80" rx="40" fill="${backgroundColor}"/>` +
    `<text x="40" y="48" text-anchor="middle" font-size="30" fill="white" font-family="Arial, sans-serif">${safeLabel}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
