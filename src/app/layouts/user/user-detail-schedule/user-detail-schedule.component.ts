import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  content: string;
  isRead: boolean;
}
@Component({
  selector: 'app-user-detail-schedule',
  standalone: false,
  templateUrl: './user-detail-schedule.component.html',
  styleUrl: './user-detail-schedule.component.scss'
})
export class UserDetailScheduleComponent {
@Input() selectedMeeting: Meeting | null = null;
  @Input() userImage: string = '';
  @Input() userEmail: string = '';
  @Output() signOutClicked = new EventEmitter<void>();

  constructor() {}

  onSignOut() {
    this.signOutClicked.emit();
  }

  onMeetingSelected(meeting: Meeting) {
    this.selectedMeeting = meeting;
  }

  get displayTitle(): string {
    return this.selectedMeeting?.title || 'Chưa chọn cuộc họp';
  }

  get displayDate(): string {
    return this.selectedMeeting?.date || '';
  }

  get displayTime(): string {
    return this.selectedMeeting?.time || '';
  }

  get displayContent(): string {
    return this.selectedMeeting?.content || 'Vui lòng chọn một cuộc họp từ danh sách để xem chi tiết.';
  }
}
