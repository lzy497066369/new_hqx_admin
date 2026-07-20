import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  export const MenuTypes = ['catalog', 'menu', 'button'] as const;

  export interface SystemMenu {
    [key: string]: any;
    authCode?: string;
    children?: SystemMenu[];
    component?: string;
    id: string;
    meta?: {
      icon?: string;
      title: string;
    };
    name: string;
    orderNum?: number;
    parentId?: null | string;
    path: string;
    redirect?: string;
    status: 0 | 1;
    type: (typeof MenuTypes)[number];
  }
}

async function getMenuList() {
  return requestClient.get<Array<SystemMenuApi.SystemMenu>>(
    '/system/menu/list',
  );
}

async function isMenuNameExists(
  name: string,
  id?: SystemMenuApi.SystemMenu['id'],
) {
  return requestClient.get<boolean>('/system/menu/name-exists', {
    params: { id, name },
  });
}

async function isMenuPathExists(
  path: string,
  id?: SystemMenuApi.SystemMenu['id'],
) {
  return requestClient.get<boolean>('/system/menu/path-exists', {
    params: { id, path },
  });
}

async function createMenu(
  data: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>,
) {
  return requestClient.post('/system/menu', data);
}

async function updateMenu(
  id: string,
  data: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>,
) {
  return requestClient.put(`/system/menu/${id}`, data);
}

async function deleteMenu(id: string) {
  return requestClient.delete(`/system/menu/${id}`);
}

export {
  createMenu,
  deleteMenu,
  getMenuList,
  isMenuNameExists,
  isMenuPathExists,
  updateMenu,
};
