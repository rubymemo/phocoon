import axios from 'axios';
import type { HttpResponse } from '@/api/interceptor';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState, RoleType } from '@/store/modules/user/types';

export interface UserRecord {
  id: string;
  account: string;
  createDate: string;
  modifyDate: string;
  password: string;
  roleName: RoleType;
  status: string;
  userName: string;
}
export interface UserParams extends Partial<UserRecord> {
  current: number;
  pageSize: number;
}


export const UserRoleEnum = {
  admin: 'admin', 
  user: 'user',
  finance: 'finance',
  data: 'data',
  operation: 'operation',  
}

export const UserRoleTextMap = new Map([
  [ UserRoleEnum.admin, '管理员'],
  [ UserRoleEnum.user, '用户'],
  [ UserRoleEnum.finance,'财务'],
  [ UserRoleEnum.data,'数据分析师'],
  [ UserRoleEnum.operation,'运维']
]
)

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  data: string;
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('/admin/user/login', data);
}

export function logout() {
  return Promise.resolve({
    code: 0
  })
}



export async function getUserInfo() {
  const res = await axios.post<UserRecord>('/admin/user/getUserInfo'); 
  return {
    data: {
      ...res.data,
      name: res.data.userName,
      role: res.data.roleName,
    }
  }
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}


export async function getAccountList(data:Record<any,string>) {
  return axios.post<UserRecord[]>('/admin/user/queryUserList', data);
}
export async function updateAccount(data:Record<any,string>) {
  return axios.post('/admin/user/updateUser', data);
}
export async function addAccount(data:Record<any,string>) {
  return axios.post('/admin/user/addUser', data);
}
export async function deleteAccount(data:Record<any,string>) {
  return axios.post('/admin/user/deleteUser', data);
}