import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response.model';
import { Observable } from 'rxjs';
import { ScheduleResponse } from '../models/schedule.model';
import { RoomRequest, RoomResponse, RoomWithStatus } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8080/rooms';

  constructor(private http: HttpClient) {}

  getRoomsWithStatus(): Observable<ApiResponse<RoomWithStatus[]>> {
    return this.http.get<ApiResponse<RoomWithStatus[]>>(`${this.apiUrl}/with-status`);
  }

  getAvailableRooms(startDate: Date, endDate: Date): Observable<ApiResponse<RoomResponse[]>> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    return this.http.get<ApiResponse<RoomResponse[]>>(`${this.apiUrl}/available`, { params });
  }

}
