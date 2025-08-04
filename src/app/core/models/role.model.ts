export enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER'
}

export interface AssignRoleRequest {
  roleName: RoleType;
}
