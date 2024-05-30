import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DATA: AppRouteRecordRaw = {
  path: '/finance',
  name: 'finance',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.finance',
    requiresAuth: true,
    icon: 'icon-file',
    order: 2,
  },
  children: [
    {
      path: 'settlement', // The midline path complies with SEO specifications
      name: 'FinanceSettlement',
      component: () => import('@/views/finance/settlement/index.vue'),
      meta: {
        locale: 'menu.finance.settlement',
        requiresAuth: true,
        roles: ['admin', 'finance'],
      },
    },
    {
      path: 'settlementlog', // The midline path complies with SEO specifications
      name: 'FinanceSettlementLog',
      component: () => import('@/views/finance/settlementlog/index.vue'),
      meta: {
        locale: 'menu.finance.settlementlog',
        requiresAuth: true,
        roles: ['admin', 'finance'],
        hideInMenu: true,
      }
    }
  ],
};

export default DATA;


