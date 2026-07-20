import {
  appCopyrightPreferences,
  defineOverridesPreferences,
} from '@vben/preferences';

import { WORKSPACE_HOME_PATH } from '#/router/home-path';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    accessMode: 'backend',
    defaultHomePath: WORKSPACE_HOME_PATH,
    enableRefreshToken: true,
    name: import.meta.env.VITE_APP_TITLE,
  },
  copyright: appCopyrightPreferences,
});

// {
//   "app": {
//     "layout": "sidebar-mixed-nav"
//   },
//   "sidebar": {
//     "collapsedButton": false,
//     "fixedButton": false
//   },
//   "theme": {
//     "builtinType": "sky-blue",
//     "colorPrimary": "hsl(231 98% 65%)",
//     "mode": "light"
//   },
//   "transition": {
//     "name": "fade"
//   }
// }
