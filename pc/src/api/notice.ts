import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface NoticeRecord {
  id: string;
  title: string;
  context: string;
  status: string;
  createDate: string;
  modifyDate: string;
}

export interface NoticeParams extends Partial<NoticeRecord> {
  current?: number;
  pageSize?: number;
}


export function addNotice(data: NoticeParams) {
  return axios.post('/admin/notice/addNotice', data);
}
export function updateNotice(data: NoticeParams) {
  return axios.post('/admin/notice/updateNotice', data);
}
export function deleteNotice(data: NoticeParams) {
  return axios.post('/admin/notice/deleteNotice', data);
}
export function queryNoticeList(data: NoticeParams) {
  return axios.post<NoticeRecord[]>('/admin/notice/queryNoticeList', data);
}

export interface LinkRecord {
  id: string;
  shortCode: string;
  shortName: string;
  gameName: string;
  longUrl: string;
  shortUrl: string;
  createDate: string;
  host: string;
}

export interface LinkParams extends Partial<LinkRecord> {
  current?: number;
  pageSize?: number;
}

export function queryShortLinkList(data: LinkParams) {
  return axios.post<LinkRecord[]>('/admin/shortLink/queryShortLinkList', data);
}
export function addShortLink(data: LinkParams) {
  return axios.post('/admin/shortLink/createShortLink', data);
}

export function updateShortLink(data: LinkParams) {
  return axios.post('/admin/shortLink/updateShortLink', data);
}
export function deleteShortLink(data: LinkParams) {
  return axios.post('/admin/shortLink/deleteShortLink', data);
}
