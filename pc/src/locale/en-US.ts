import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeSearchTable from '@/views/list/search-table/locale/en-US';
import localeCardList from '@/views/list/card/locale/en-US';


import locale403 from '@/views/exception/403/locale/en-US';
import locale404 from '@/views/exception/404/locale/en-US';
import locale500 from '@/views/exception/500/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'menu.data': 'data',
  'menu.data.correction': 'datacorrection',
  'menu.data.publish': 'publish',
  'menu.channel': 'channel',
  'menu.channel.review': 'channelreview',
  'menu.channel.list': 'channellist',
  'menu.channel.relation': 'relation',
  'menu.channel.analyze': 'analyze',
  'menu.channel.notice': 'notices',
  'menu.channel.link': 'links',
  'menu.game': '游戏管理',
  'menu.game.list': '游戏列表',
  'menu.game.analyze': '游戏分析',
  'menu.game.last': '剩余名额',
  'menu.finance': '财务对账',
  'menu.finance.settlement': '结算管理',
  'menu.finance.settlementlog': '结算记录',
  'menu.setting': '设置',
  'menu.setting.account': '后台账号管理',

  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeSearchTable,
  ...localeCardList,
  ...locale403,
  ...locale404,
  ...locale500,
};
