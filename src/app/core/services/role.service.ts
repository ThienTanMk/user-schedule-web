import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response.model';
import { Observable } from 'rxjs';
import { AssignRoleRequest } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = 'http://localhost:8080/roles';
  constructor(private http: HttpClient) {}

  assignRoleToUser(userId: number, request: AssignRoleRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/assign/${userId}`, request);
  }

  unassignRoleFromUser(userId: number, request: AssignRoleRequest): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/unassign/${userId}`, {
      body: request
    });
  }
}
