import { Component, OnInit } from '@angular/core';
import { RoomResponse, RoomWithStatus } from '../../../core/models/room.model';
import { RoomService } from '../../../core/services/room.service';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-room',
  standalone: false,
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit {
  roomsByLocation: { [key: string]: (RoomResponse | RoomWithStatus)[] } = {};
  locations: string[] = [];
  isLoading = false;
  error: string | null = null;
  startDate: string = '';
  endDate: string = '';
  showAvailableRooms = false;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  private loadRooms(): void {
    this.roomService.getRoomsWithStatus().subscribe({
      next: (response: ApiResponse<RoomWithStatus[]>) => {
        this.isLoading = false;
        if (response.data && response.data.length > 0) {
          this.roomsByLocation = response.data.reduce((acc, room) => {
            if (!acc[room.location]) {
              acc[room.location] = [];
            }
            acc[room.location].push(room);
            return acc;
          }, {} as { [key: string]: RoomWithStatus[] });
          this.locations = Object.keys(this.roomsByLocation);
        } else {
          this.error = 'Không có phòng nào được tìm thấy';
        }
      },
    });
  }

  searchAvailableRooms(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Vui lòng chọn thời gian bắt đầu và kết thúc';
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      this.error = 'Thời gian không hợp lệ';
      return;
    }

    if (end <= start) {
      this.error = 'Thời gian kết thúc phải sau thời gian bắt đầu';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.showAvailableRooms = true;

    this.roomService.getAvailableRooms(start, end).subscribe({
      next: (response: ApiResponse<RoomResponse[]>) => {
        this.isLoading = false;
        if (response.data && response.data.length > 0) {
          this.roomsByLocation = response.data.reduce((acc, room) => {
            if (!acc[room.location]) acc[room.location] = [];
            acc[room.location].push(room);
            return acc;
          }, {} as { [key: string]: RoomResponse[] });
          this.locations = Object.keys(this.roomsByLocation).sort();
        } else {
          this.error = 'Không có phòng trống trong khoảng thời gian này';
          this.roomsByLocation = {};
          this.locations = [];
        }
      },
    });
  }

  resetSearch(): void {
    this.startDate = '';
    this.endDate = '';
    this.showAvailableRooms = false;
    this.error = null;
    this.loadRooms();
  }

  hasStatus(room: any): room is RoomWithStatus {
    return 'status' in room;
  }
}
