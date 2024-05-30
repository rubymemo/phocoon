import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DATA: AppRouteRecordRaw = {
  path: '/data',
  name: 'data',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.data',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 2,
  },
  children: [
    {
      path: 'correction', // The midline path complies with SEO specifications
      name: 'DataCorrection',
      component: () => import('@/views/data/search-table/index.vue'),
      meta: {
        locale: 'menu.data.correction',
        requiresAuth: true,
        // roles: ['*'],
        roles: ['admin', 'operation', 'data'],
      },
    },
    {
      path: 'publish', // The midline path complies with SEO specifications
      name: 'DataPublish',
      component: () => import('@/views/data/list/index.vue'),
      meta: {
        locale: 'menu.data.publish',
        requiresAuth: true,
        roles: ['admin', 'operation', 'data'],
      },
    },
  ],
};

export default DATA;


