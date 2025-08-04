import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DepartmentCreationRequest, DepartmentResponse } from '../models/department.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = 'http://localhost:8080/departments';
  constructor(private http: HttpClient) {}

  createDepartment(request: DepartmentCreationRequest): Observable<ApiResponse<DepartmentResponse>> {
    return this.http.post<ApiResponse<DepartmentResponse>>(`${this.apiUrl}`,request);
  }

  deleteDepartment(departmentId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${departmentId}`);
  }

  getAllDepartments(): Observable<ApiResponse<DepartmentResponse[]>> {
    return this.http.get<ApiResponse<DepartmentResponse[]>>(`${this.apiUrl}/all`);
  }

  getUsersByDepartment(departmentId: number): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${departmentId}/users`);
  }

  getDepartmentById(departmentId: number): Observable<ApiResponse<DepartmentResponse>> {
    return this.http.get<ApiResponse<DepartmentResponse>>(`${this.apiUrl}/${departmentId}`);
  }
}
