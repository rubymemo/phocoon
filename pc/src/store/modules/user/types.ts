export type RoleType = '' | '*' | 'admin' | 'user' | 'finance' | 'data' | 'operations';
export interface UserState {
  account?: string;
  name?: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  role: RoleType;
  roleName?: RoleType
}
export interface RawResponse<T = Record<string, unknown | null>> {
  code: number;
  data?: T; // 有的接口用的data，有的用的content
  msg: string;
}