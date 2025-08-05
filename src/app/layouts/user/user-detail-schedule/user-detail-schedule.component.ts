import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScheduleResponse } from '../../../core/models/schedule.model';

@Component({
  selector: 'app-user-detail-schedule',
  standalone: false,
  templateUrl: './user-detail-schedule.component.html',
  styleUrl: './user-detail-schedule.component.scss'
})
export class UserDetailScheduleComponent {
  @Input() selectedMeeting: ScheduleResponse | null = null;
  @Input() userEmail: string = '';
  @Output() signOutClicked = new EventEmitter<void>();

  constructor() { }

  onSignOut() {
    this.signOutClicked.emit();
  }

  onMeetingSelected(meeting: ScheduleResponse) {
    this.selectedMeeting = meeting;
  }

  get displayTitle(): string {
    return this.selectedMeeting?.title || 'Chưa chọn cuộc họp';
  }

  get displayDate(): string {
    const startTime = this.selectedMeeting ? new Date(this.selectedMeeting.startTime) : null;
    return startTime ? this.formatDate(startTime) : '';
  }

  get displayTime(): string {
    if (!this.selectedMeeting) return '';
    const startTime = new Date(this.selectedMeeting.startTime);
    const endTime = new Date(this.selectedMeeting.endTime);
    return `${this.formatTime(startTime)} - ${this.formatTime(endTime)}`;
  }
  private formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  get displayRoom(): string {
    return this.selectedMeeting?.room?.name || '';
  }

  get displayLocation(): string {
    return this.selectedMeeting?.room?.location || '';
  }
}
