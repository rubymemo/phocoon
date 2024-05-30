import axios from 'axios';

export interface DataRecord {
  id: string;
  correctionDate: string;
  channelName: string;
  channelId: string;
  gameName: string;
  gameId: string;
  number: number;
  collectionName: string;
  beforeCorrectionActive: number;
  afterCorrectionActive: number;
  beforeCorrectionProfits: number;
  afterCorrectionProfits: number;
  createDate?: Date;
  modifyDate?: Date;
}

export interface DataParams extends Partial<DataRecord> {
  current?: number;
  pageSize?: number;
}

export function queryDataList(data: DataParams) {
  return axios.post<DataRecord[]>('/admin/correction/list', data);
}

export function updateDataInfo(data: any): Promise<any> {
  return axios.post<{ code: number }>('/admin/correction/update', data);
}

export function publishAllData(): Promise<any> {
  return axios.post<{ code: number }>('/admin/correction/publish');
}
export function clearAllData(): Promise<any> {
  return axios.post<{ code: number }>('/admin/correction/clear');
}


export function queryPublishDataList(data: DataParams) {
  return axios.post<DataRecord[]>('/admin/correctionProfit/list', data);
}

export function updatePublishInfo(data: any): Promise<any> {
  return axios.post<{ code: number }>('/admin/correctionProfit/update', data);
}