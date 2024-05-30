import axios from 'axios';

export interface FinanceRecord {
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

export interface FinanceParams extends Partial<FinanceRecord> {
  current?: number;
  pageSize?: number;
}

export function queryFinanceList(data: FinanceParams) {
  return axios.post('/admin/settlement/querySettlementList', data);
}

export function updateSettlement(data: FinanceParams) {
  return axios.post('/admin/settlement/updateSettlement', data);
}

// 结算记录
export function queryFinanceLogs(data: FinanceParams) {
  return axios.post('/admin/settlementRecord/querySettlementRecordList', data);
}
// 修改结算
export function updateSettlementStatus(data: FinanceParams) {
  return axios.post('/admin//settlementRecord/updateSettlementStatus ', data);
}

export function updateSettlementVoucher(data: any) {
  return axios.post('/admin//settlementRecord/uploadSettlementVoucher  ', data);
}
export function upSettlementVoucher(data: any) {
  return axios.post('/admin/channelGameRelation/applyChannelList', data);
}




