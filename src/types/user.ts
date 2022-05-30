import { Role } from './common';
export interface UserInfo {
  email: string;
  name: string;
  image?: string | null;
  userRole?: UserRole;
}
export interface UserRole {
  id: number;
  name: string;
  code: Role;
}
