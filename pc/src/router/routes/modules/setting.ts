import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DATA: AppRouteRecordRaw = {
  path: '/setting',
  name: 'setting',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.setting',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 2,
  },
  children: [
    {
      path: 'account', // The midline path complies with SEO specifications
      name: 'SettingAccount',
      component: () => import('@/views/setting/account/index.vue'),
      meta: {
        locale: 'menu.setting.account',
        requiresAuth: true,
        roles: ['admin'],
      },
    }
  ],
};

export default DATA;


