import axios from 'axios';

export interface GameRecord {
  id: string;
  number: number;
  name: string;
  contentType: 'img' | 'horizontalVideo' | 'verticalVideo';
  filterType: 'artificial' | 'rules';
  count: number;
  status: 'online' | 'offline';
  createdTime: string;
}

export interface GameParams extends Partial<GameRecord> {
  current: number;
  pageSize: number;
}

export function addGame(data: GameRecord) {
  return axios.post('/admin/sysGame/addGame', data);
}
export function updateGame(data: GameRecord) {
  return axios.post('/admin/sysGame/updateGame', data);
}
export function deleteGame(data: GameRecord) {
  return axios.post('/admin/sysGame/deleteGame', data);
}
export function upTopGame(data: { id: string }) {
  return axios.post('/admin/sysGame/updateSort', data);
}
export function queryGameList(data: GameParams) {
  return axios.post<GameRecord[]>('/admin/sysGame/queryGameList ', data);
}

export function queryGameRemainingList (data: GameParams) {
  return axios.post<GameRecord[]>('/admin/sysGame/queryGameRemainingList  ', data);
}
export function queryGameAnalysisList (data: GameParams) {
  return axios.post<GameRecord[]>('/admin/analysis/queryGameAnalysis', data);
}
