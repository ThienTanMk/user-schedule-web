import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScheduleByDepartmentRequest, ScheduleCreationRequest, ScheduleResponse, ScheduleUpdateRequest } from '../models/schedule.model';
import { ApiResponse } from '../models/api-response.model';
import { Observable } from 'rxjs';
import { FreeTimeSlot } from '../models/free-time-slot.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:8080/schedules';
  constructor(private http: HttpClient) {}

  createSchedule(request: ScheduleCreationRequest): Observable<ApiResponse<ScheduleResponse>> {
    return this.http.post<ApiResponse<ScheduleResponse>>(`${this.apiUrl}`, request);
  }

  createScheduleForDepartment(
    request: ScheduleByDepartmentRequest,
    departmentName: string
  ): Observable<ApiResponse<ScheduleResponse>> {
    return this.http.post<ApiResponse<ScheduleResponse>>(
      `${this.apiUrl}/departments/${departmentName}`,
      request
    );
  }

  getSchedulesByKeycloakId(keycloakId: string): Observable<ApiResponse<ScheduleResponse[]>> {
    return this.http.get<ApiResponse<ScheduleResponse[]>>(`${this.apiUrl}/users/${keycloakId}`);
  }

  updateSchedule(
    scheduleId: number,
    request: ScheduleUpdateRequest
  ): Observable<ApiResponse<ScheduleResponse>> {
    return this.http.put<ApiResponse<ScheduleResponse>>(`${this.apiUrl}/${scheduleId}`, request);
  }

  getScheduleById(scheduleId: number): Observable<ApiResponse<ScheduleResponse>> {
    return this.http.get<ApiResponse<ScheduleResponse>>(`${this.apiUrl}/${scheduleId}`);
  }

  deleteSchedule(scheduleId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${scheduleId}`);
  }

  getAvailableSlotsBetween(
    roomName: string,
    startDate: Date,
    endDate: Date
  ): Observable<ApiResponse<FreeTimeSlot[]>> {
    return this.http.get<ApiResponse<FreeTimeSlot[]>>(
      `${this.apiUrl}/free/${roomName}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
  }

  createSimpleSchedule(request: ScheduleByDepartmentRequest): Observable<ApiResponse<ScheduleResponse>> {
    return this.http.post<ApiResponse<ScheduleResponse>>(`${this.apiUrl}/simple`, request);
  }
}
