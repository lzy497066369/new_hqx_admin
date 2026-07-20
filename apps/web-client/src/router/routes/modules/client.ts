import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:cellphone',
      order: 100,
      title: '客户端',
    },
    name: 'Client',
    path: '/client',
    redirect: '/client/home',
    children: [
      {
        component: () => import('#/views/client/home/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:home',
          title: '客户端首页',
        },
        name: 'ClientHome',
        path: '/client/home',
      },
      {
        component: () => import('#/views/client/tasks/index.vue'),
        meta: {
          icon: 'mdi:clipboard-check-outline',
          title: '待办事项',
        },
        name: 'ClientTasks',
        path: '/tasks',
      },
      {
        component: () => import('#/views/client/company-switch/index.vue'),
        meta: {
          icon: 'lucide:repeat-2',
          title: '公司切换',
        },
        name: 'ClientCompanySwitch',
        path: '/client/company-switch',
      },
      {
        component: () => import('#/views/client/profile/index.vue'),
        meta: {
          icon: 'lucide:user-round',
          title: '个人情况',
        },
        name: 'ClientProfile',
        path: '/client/profile',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/company.vue'),
        meta: {
          icon: 'lucide:building-2',
          title: '公司资料',
        },
        name: 'ClientCompany',
        path: '/client/company',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/company-basic.vue'),
        meta: {
          icon: 'lucide:clipboard-pen-line',
          title: '基础信息维护',
        },
        name: 'ClientCompanyBasic',
        path: '/client/company/basic',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/company-contacts.vue'),
        meta: {
          icon: 'lucide:contact',
          title: '联系人维护',
        },
        name: 'ClientCompanyContacts',
        path: '/client/company/contacts',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/company-materials.vue'),
        meta: {
          icon: 'lucide:file-up',
          title: '材料模板中心',
        },
        name: 'ClientCompanyMaterials',
        path: '/client/company/materials',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/finance/index.vue'),
        meta: {
          hideInMenu: true,
          title: '财税',
        },
        name: 'ClientCompanyTax',
        path: '/client/company/tax',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/employee/index.vue'),
        meta: {
          hideInMenu: true,
          title: '员工',
        },
        name: 'ClientCompanyEmployees',
        path: '/client/company/employees',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/property/index.vue'),
        meta: {
          hideInMenu: true,
          title: '研发与知识产权',
        },
        name: 'ClientCompanyProperty',
        path: '/client/company/property',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/contract/index.vue'),
        meta: {
          hideInMenu: true,
          title: '合同和发票',
        },
        name: 'ClientCompanyContract',
        path: '/client/company/contract',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/document/index.vue'),
        meta: {
          hideInMenu: true,
          title: '制度文件',
        },
        name: 'ClientCompanyDocument',
        path: '/client/company/document',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/company-materials.vue'),
        meta: {
          hideInMenu: true,
          title: '企业证书',
        },
        name: 'ClientCompanyCertificates',
        path: '/client/company/certificates',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/company-materials.vue'),
        meta: {
          hideInMenu: true,
          title: '照片',
        },
        name: 'ClientCompanyPhotos',
        path: '/client/company/photos',
      },
      {
        component: () =>
          import('#/views/client/enterprise-profile/company-account.vue'),
        meta: {
          hideInMenu: true,
          title: '企业账号',
        },
        name: 'ClientCompanyAccount',
        path: '/client/company/account',
      },
      {
        component: () => import('#/views/client/enterprise-user/index.vue'),
        meta: {
          icon: 'mdi:account',
          title: '账号资料',
        },
        name: 'ClientEnterpriseUser',
        path: '/client/enterprise-user',
      },
    ],
  },
  {
    meta: {
      icon: 'mdi:newspaper-variant-outline',
      order: 20,
      title: '政策中心',
    },
    name: 'ClientPolicyCenter',
    path: '/policy',
    redirect: '/policy/library',
    children: [
      {
        component: () => import('#/views/client/policy-library/index.vue'),
        meta: {
          icon: 'mdi:newspaper-variant-outline',
          title: '政策库',
        },
        name: 'ClientPolicyLibrary',
        path: '/policy/library',
      },
    ],
  },
  {
    meta: {
      icon: 'mdi:file-document-edit-outline',
      order: 25,
      title: '申报项目',
    },
    name: 'ClientProjects',
    path: '/projects',
    redirect: '/projects/list',
    children: [
      {
        component: () => import('#/views/client/projects/list.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted-square',
          title: '项目列表',
        },
        name: 'ClientProjectList',
        path: '/projects/list',
      },
      {
        component: () => import('#/views/client/projects/detail.vue'),
        meta: {
          hideInMenu: true,
          title: '项目详情',
        },
        name: 'ClientProjectDetail',
        path: '/projects/detail/:id',
      },
      {
        component: () => import('#/views/client/projects/my.vue'),
        meta: {
          icon: 'mdi:folder-account-outline',
          title: '我的申报列表',
        },
        name: 'ClientMyProjectList',
        path: '/projects/my',
      },
      {
        component: () => import('#/views/client/projects/my-detail.vue'),
        meta: {
          hideInMenu: true,
          title: '申报详情',
        },
        name: 'ClientMyProjectDetail',
        path: '/projects/my/detail/:id',
      },
    ],
  },
];

export default routes;
