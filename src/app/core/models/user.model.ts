export interface UserResponse {
  userId: number;
  keycloakId: string;
  username: string;
  firstname: string;
  lastname: string;
  dob: string;
  email: string;
  department: DepartmentResponse;
}

export interface DepartmentResponse {
  id: number;
  name: string;
  description?: string;
}
