export type DashboardUser = {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export interface GetUsersResponse {
  totalUsers: number;
  users: DashboardUser[];
}

export interface GetAdminsResponse {
  totalAdmins: number;
  admins: DashboardUser[];
}
