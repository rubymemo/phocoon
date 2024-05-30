import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DATA: AppRouteRecordRaw = {
  path: '/channel',
  name: 'channel',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.channel',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 2,
  },
  children: [
    {
      path: 'review', // The midline path complies with SEO specifications
      name: 'AccessReview',
      component: () => import('@/views/channel/access-review/index.vue'),
      meta: {
        locale: 'menu.channel.review',
        requiresAuth: true,
        roles: ['admin', 'operation', 'data']
      },
    },
    {
      path: 'list', // The midline path complies with SEO specifications
      name: 'Channellist',
      component: () => import('@/views/channel/list/index.vue'),
      meta: {
        locale: 'menu.channel.list',
        requiresAuth: true,
        roles: ['admin', 'operation', 'data']
      },
    },
    {
      path: 'relation', // The midline path complies with SEO specifications
      name: 'ChannelRelation',
      component: () => import('@/views/channel/relation/index.vue'),
      meta: {
        locale: '绑定关系',
        requiresAuth: true,
        roles: ['admin', 'operation', 'data'],
        hideInMenu: true,
      },
    },
    {
      path: 'analyze', // The midline path complies with SEO specifications
      name: 'ChannelAnalyze',
      component: () => import('@/views/channel/analyze/index.vue'),
      meta: {
        locale: 'menu.channel.analyze',
        requiresAuth: true,
        roles: ['admin', 'operation', 'data'],
      },
    },
    {
      path: 'notice', // The midline path complies with SEO specifications
      name: 'ChannelNotice',
      component: () => import('@/views/channel/notice/index.vue'),
      meta: {
        locale: 'menu.channel.notice',
        requiresAuth: true,
        roles: ['admin', 'operation', 'data'],
      },
    },
    {
      path: 'link', // The midline path complies with SEO specifications
      name: 'ChannelLink',
      component: () => import('@/views/channel/link/index.vue'),
      meta: {
        locale: 'menu.channel.link',
        requiresAuth: true,
        roles: ['admin', 'operation', 'data'],
      },
    },
  ],
};

export default DATA;


