import Mock from 'mockjs';

import './user';
import './message-box';


import '@/views/list/card/mock';
import '@/views/list/search-table/mock';


Mock.setup({
  timeout: '600-1000',
});
