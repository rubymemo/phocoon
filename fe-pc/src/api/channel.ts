import axios from 'axios';

export interface ApplyRecord {
  id: string;
  status: string;
  applyDate: string;
  gameName: string;
  gameId: string;
  channelLimit: number;
  commisionRate: number;
  channelId: string;
  channelName: string;
  promotionUrl: string;
  collectionTag: string;
  channelGameRelationId?: string;
  startDate?: string;
  endDate?: string;
  registerDate?: string;
}

export interface ApplyParams extends Partial<ApplyRecord> {
  current?: number;
  pageSize?: number;
}

export function queryApplyChannelList(data: ApplyParams) {
  return axios.post('/admin/channelGameRelation/applyChannelList', data);
}
export function updateChannelGameRelation(data: ApplyParams) {
  return axios.post('/admin/channelGameRelation/updateChannelGameRelation', data);
}
export function updateChannelStatus(data: ApplyParams) {
  return axios.post('/admin/channelGameRelation/updateStatus', data);
}

export interface ChannelRecord {
  id: string;
  profit: string;
  activityUser: string;
  collectionTag: string;
  commisionRate: number;
  gameName: string;
  gameId: string;
  promotionUrl: string;
  status: string;
  applyDate: string;
  registerDate?: string;
  relationId?: string;
}
export interface ChannelParams extends Partial<ChannelRecord> {
  current?: number;
  pageSize?: number;
}

// 获取渠道列表
export async function getChannels(data: any) {
  const dataTemp = {...data} as {
    channelName?: any;
    current?: any;
    gameName?: any;
    pageSize?: any;
    registerDate?: [string, string];
    startDate?: string;
    endDate?: string;
  };
  dataTemp.startDate = (data.registerDate && Array.isArray(data.registerDate)) ? data.registerDate[0] : undefined;
  dataTemp.endDate = (data.registerDate && Array.isArray(data.registerDate)) ? data.registerDate[1] : undefined;
  delete dataTemp.registerDate;
  console.log(dataTemp);
  return axios.post(`/admin/channel/queryChannelList`, dataTemp);
}

// 回收链接
export async function recycleChannelsLink(data: ChannelParams) {
  return axios.post(`/admin/channelGameRelation/recycleUrl`, data);
}

export interface ChannelRelationRecord {
  id: string;
  sonChannelName: string;
  parentChannelId: string;
  parentChannelName: string;
  parentCommission: number;
  sonChannelCount: number;
  sonChannelProfitsTotal: number;
  sonChannelActivityTotal: number;
  bindDate: string;
}
export interface ChannelRelationParams extends Partial<ChannelRelationRecord> {
  current?: number;
  pageSize?: number;
  parentChannelId?: string;
}
// 关系列表
export async function channelRelationList(data: ChannelRelationParams) {
  const dataTemp = {...data} as {
    sonChannelName?: any;
    current?: any;
    pageSize?: any;
    registerDate?: [string, string];
    startDate?: string;
    endDate?: string;
  };
  dataTemp.startDate = (data.registerDate && Array.isArray(data.registerDate)) ? data.registerDate[0] : undefined;
  dataTemp.endDate = (data.registerDate && Array.isArray(data.registerDate)) ? data.registerDate[1] : undefined;
  delete dataTemp.registerDate;
  console.log(dataTemp);
  return axios.post(`/admin/channel/queryChannelRelationList`, dataTemp);
}

// 渠道分析
export async function queryChannelAnalysisList(data: ChannelParams) {
  return axios.post(`/admin/analysis/queryChannelAnalysis`, data);
}
