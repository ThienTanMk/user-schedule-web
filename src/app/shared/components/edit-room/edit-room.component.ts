import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoomRequest, RoomResponse } from '../../../core/models/room.model';
import { RoomService } from '../../../core/services/room.service';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-edit-room',
  standalone: false,
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.scss'
})
export class EditRoomComponent {
  @Input() showModal = false;
  @Input() isEditMode = false;
  @Input() room: RoomRequest = { name: '', location: '', capacity: 0 };
  @Input() roomId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<RoomRequest>();
  @Input() error: string | null = null;
  isLoading = false;

  // constructor(private roomService: RoomService) {}

  saveRoom(): void {
    if (!this.room.name || !this.room.location || this.room.capacity <= 0) {
      this.error = 'Vui lòng điền đầy đủ thông tin và sức chứa phải lớn hơn 0';
      return;
    }
    this.error = null;
    this.save.emit(this.room);

    // if (this.isEditMode && this.roomId !== null) {
    //   this.roomService.updateRoom(this.roomId, this.room).subscribe({
    //     next: (response: ApiResponse<RoomResponse>) => {
    //       this.isLoading = false;
    //       if (response.data) {
    //         this.save.emit(response.data);
    //       }
    //     },
    //     error: (err) => {
    //       this.isLoading = false;
    //       this.error = err.error?.message || 'Đã có lỗi xảy ra khi cập nhật phòng';
    //     },
    //   });
    // } else {
    //   this.roomService.createRoom(this.room).subscribe({
    //     next: (response: ApiResponse<RoomResponse>) => {
    //       this.isLoading = false;
    //       if (response.data) {
    //         this.save.emit(response.data);
    //       }
    //     },
    //     error: (err) => {
    //       this.isLoading = false;
    //       this.error = err.error?.message || 'Đã có lỗi xảy ra khi tạo phòng';
    //     },
    //   });
    // }
  }

  closeModal(): void {
    this.close.emit();
  }
}
