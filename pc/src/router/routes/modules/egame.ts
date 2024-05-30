import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DATA: AppRouteRecordRaw = {
  path: '/game',
  name: 'game',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.game',
    requiresAuth: true,
    icon: 'icon-common',
    order: 2,
  },
  children: [
    {
      path: 'list', // The midline path complies with SEO specifications
      name: 'GameList',
      component: () => import('@/views/game/list/index.vue'),
      meta: {
        locale: 'menu.game.list',
        requiresAuth: true,
        roles: ['admin', 'operation', 'data'],
      },
    },
    {
      path: 'analyze', // The midline path complies with SEO specifications
      name: 'GameAnalyze',
      component: () => import('@/views/game/analyze/index.vue'),
      meta: {
        locale: 'menu.game.analyze',
        requiresAuth: true,
        roles: ['admin', 'operation', 'data'],
      },
    },
    // {
    //   path: 'last', // The midline path complies with SEO specifications
    //   name: 'GameLast',
    //   component: () => import('@/views/game/last/index.vue'),
    //   meta: {
    //     locale: 'menu.game.last',
    //     requiresAuth: true,
    //     roles: ['admin', 'operation', 'data'],
    //   },
    // }
  ],
};

export default DATA;
