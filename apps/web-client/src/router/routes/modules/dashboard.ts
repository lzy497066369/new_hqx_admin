import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 1,
      title: '数据工作台',
    },
    name: 'Dashboard',
    path: '/dashboard',
    redirect: '/dashboard/workspace',
    children: [
      {
        component: () => import('#/views/dashboard/workspace/index.vue'),
        meta: {
          affixTab: true,
          icon: 'carbon:workspace',
          title: '工作台',
        },
        name: 'ClientDashboardWorkspace',
        path: '/dashboard/workspace',
      },
      {
        component: () => import('#/views/dashboard/analytics/index.vue'),
        meta: {
          icon: 'lucide:area-chart',
          title: '数据分析',
        },
        name: 'ClientDashboardAnalytics',
        path: '/dashboard/analytics',
      },
    ],
  },
];

export default routes;
