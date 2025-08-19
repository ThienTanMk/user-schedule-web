import { Component, OnInit } from '@angular/core';
import { RoomRequest, RoomResponse, RoomWithStatus } from '../../../core/models/room.model';
import { RoomService } from '../../../core/services/room.service';
import { ApiResponse } from '../../../core/models/api-response.model';
import { AuthService } from '../../../core/services/auth.service';

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
  showModal = false;
  isEditMode = false;
  selectedRoom: RoomResponse | RoomWithStatus | null = null;
  selectedRoomIndex: number | null = null;
  selectedLocation: string | null = null;
  isAdmin = false;

  constructor(private roomService: RoomService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
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
          this.locations = Object.keys(this.roomsByLocation).sort();
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

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedRoom = null;
    this.selectedRoomIndex = null;
    this.selectedLocation = null;
    this.showModal = true;
  }

   openEditModal(room: RoomResponse | RoomWithStatus, index: number, location: string): void {
    this.isEditMode = true;
    this.selectedRoom = room;
    this.selectedRoomIndex = index;
    this.selectedLocation = location;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRoom = null;
    this.selectedRoomIndex = null;
    this.selectedLocation = null;
    this.error = null;
  }

  handleSave(updatedRoom: RoomRequest): void {
    if (this.isEditMode && this.selectedRoom && this.selectedRoomIndex != null && this.selectedLocation != null) {
      if (!this.selectedRoom.roomId) {
        this.error = 'Không tìm thấy ID phòng để cập nhật';
        return;
      }
      this.roomService.updateRoom(this.selectedRoom.roomId, updatedRoom).subscribe({
        next: (response: ApiResponse<RoomResponse>) => {
          if (this.selectedLocation && this.selectedRoomIndex != null) {
            const currentRoom = this.roomsByLocation[this.selectedLocation][this.selectedRoomIndex] as RoomWithStatus;
            this.roomsByLocation[this.selectedLocation][this.selectedRoomIndex] = {
              ...response.data,
              status: this.hasStatus(currentRoom) ? currentRoom.status : 'UNBOOKED',
            };
          }
          this.closeModal();
          this.loadRooms();
        },
      });
    } else {
      this.roomService.createRoom(updatedRoom).subscribe({
        next: (response: ApiResponse<RoomResponse>) => {
          const location = updatedRoom.location;
          if (!this.roomsByLocation[location]) {
            this.roomsByLocation[location] = [];
            this.locations = Object.keys(this.roomsByLocation).sort();
          }
          this.roomsByLocation[location].push({
            ...response.data,
            status: 'UNBOOKED',
          });
          this.closeModal();
          this.loadRooms();
        },
      });
    }
  }

  deleteRoom(room: RoomResponse | RoomWithStatus, index: number, location: string): void {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng này?')) return;

    if (!room.roomId) {
      this.error = 'Không tìm thấy ID phòng để xóa';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.roomService.deleteRoom(room.roomId).subscribe({
      next: () => {
        this.isLoading = false;
        this.roomsByLocation[location].splice(index, 1);
        if (this.roomsByLocation[location].length === 0) {
          delete this.roomsByLocation[location];
          this.locations = Object.keys(this.roomsByLocation).sort();
        }
        this.loadRooms();
      },
    });
  }
}
