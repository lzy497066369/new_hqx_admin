import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface EnterpriseProfileItem {
  address?: null | string;
  city?: null | string;
  contactEmail?: null | string;
  contactName?: null | string;
  contactPhone?: null | string;
  createTime?: string;
  creditCode: string;
  district?: null | string;
  enterpriseType?: null | string;
  id: string;
  industry?: null | string;
  legalPerson?: null | string;
  name: string;
  profileStatus: string;
  province?: null | string;
  remark?: null | string;
  shortName?: null | string;
  source?: null | string;
  status: 0 | 1;
  updateTime?: string;
}

export type EnterpriseProfileForm = Omit<
  EnterpriseProfileItem,
  'createTime' | 'id' | 'updateTime'
>;

async function getEnterpriseProfilesApi(params: Recordable<any>) {
  return requestClient.get<{
    items: EnterpriseProfileItem[];
    total: number;
  }>('/enterprise/profile/list', {
    params,
  });
}

async function getEnterpriseProfileDetailApi(id: string) {
  return requestClient.get<EnterpriseProfileItem>(`/enterprise/profile/${id}`);
}

async function createEnterpriseProfileApi(data: EnterpriseProfileForm) {
  return requestClient.post('/enterprise/profile', data);
}

async function updateEnterpriseProfileApi(
  id: string,
  data: EnterpriseProfileForm,
) {
  return requestClient.put(`/enterprise/profile/${id}`, data);
}

async function deleteEnterpriseProfileApi(id: string) {
  return requestClient.delete(`/enterprise/profile/${id}`);
}

export {
  createEnterpriseProfileApi,
  deleteEnterpriseProfileApi,
  getEnterpriseProfileDetailApi,
  getEnterpriseProfilesApi,
  updateEnterpriseProfileApi,
};
