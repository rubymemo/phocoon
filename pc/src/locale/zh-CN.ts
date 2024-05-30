import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';


import localeSearchTable from '@/views/list/search-table/locale/zh-CN';
import localeCardList from '@/views/list/card/locale/zh-CN';


import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.data': '数据',
  'menu.data.correction': '数据补正',
  'menu.data.publish': '已发布的数据',
  'menu.channel': '渠道',
  'menu.channel.review': '接入审核',
  'menu.channel.list': '渠道列表',
  'menu.channel.relation': '绑定关系',
  'menu.channel.analyze': '渠道分析',
  'menu.channel.notice': '公告通知',
  'menu.channel.link': '生成短链',
  'menu.game': '游戏管理',
  'menu.game.list': '游戏列表',
  'menu.game.analyze': '游戏分析',
  'menu.game.last': '剩余名额',
  'menu.finance': '财务对账',
  'menu.finance.settlement': '结算管理',
  'menu.finance.settlementlog': '结算记录',
  'menu.setting': '设置',
  'menu.setting.account': '后台账号管理',

  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeSearchTable,
  ...localeCardList,
  ...locale403,
  ...locale404,
  ...locale500,
};
