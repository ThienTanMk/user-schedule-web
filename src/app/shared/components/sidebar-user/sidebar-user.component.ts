import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScheduleService } from '../../../core/services/schedule.service';
import { AuthService } from '../../../core/services/auth.service';
import { ScheduleResponse } from '../../../core/models/schedule.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar-user',
  standalone: false,
  templateUrl: './sidebar-user.component.html',
  styleUrl: './sidebar-user.component.scss'
})
export class SidebarUserComponent implements OnInit {
  @Input() userEmail: string = '';
  @Input() activeMenuItem: string = '';
  @Output() menuItemSelected = new EventEmitter<string>();
  @Output() meetingSelected = new EventEmitter<ScheduleResponse>();
  @Output() signOutClicked = new EventEmitter<void>();
  showMeetingHistory: boolean = true;
  selectedMeetingId: string = '';
  meetingHistory: ScheduleResponse[] = [];
  fromAdmin: boolean = false;
  fromManager: boolean = false;
  private readonly READ_MEETINGS_KEY = 'read_meetings';
  constructor(
    private scheduleService: ScheduleService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fromAdmin = !!history.state.fromAdmin;
    this.fromManager = !!history.state.fromManager;
    const user = this.authService.getCurrentUser();
    if (user?.keycloakId) {
      this.loadMeetingHistory(user.keycloakId);
    }
  }

  private loadMeetingHistory(keycloakId: string): void {
    this.scheduleService.getSchedulesByKeycloakId(keycloakId).subscribe({
      next: (response) => {
        if (response.data) {
          const readMeetings = this.getReadMeetings();
          this.meetingHistory = response.data.map((schedule: ScheduleResponse) => {
            const startTime = new Date(schedule.startTime);
            const endTime = new Date(schedule.endTime);
            schedule.formattedDate = this.formatDate(startTime);
            schedule.formattedTime = `${this.formatTime(startTime)} - ${this.formatTime(endTime)}`;
            schedule.isRead = readMeetings.includes(schedule.scheduleId.toString());
            return schedule;
          });
        }
      },
      error: (error) => {
        console.error('Error loading meeting history:', error);
      }
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  private getReadMeetings(): string[] {
    const readMeetings = localStorage.getItem(this.READ_MEETINGS_KEY);
    return readMeetings ? JSON.parse(readMeetings) : [];
  }

  toggleMeetingHistory(): void {
    this.showMeetingHistory = !this.showMeetingHistory;
  }

  private saveReadMeetings(meetingId: string): void {
    const readMeetings = this.getReadMeetings();
    if (!readMeetings.includes(meetingId)) {
      readMeetings.push(meetingId);
      localStorage.setItem(this.READ_MEETINGS_KEY, JSON.stringify(readMeetings));
    }
  }

  selectMeeting(meeting: ScheduleResponse): void {
    this.selectedMeetingId = meeting.scheduleId.toString();
    if (!meeting.isRead) {
      meeting.isRead = true;
      this.saveReadMeetings(meeting.scheduleId.toString());
    }
    this.menuItemSelected.emit('');
    this.meetingSelected.emit(meeting);
  }

  selectMenuItem(menuId: string): void {
    this.selectedMeetingId = '';
    this.menuItemSelected.emit(menuId);
  }

  goBackToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  signOut(): void {
    this.signOutClicked.emit();
  }

  getMeetingItemClass(meeting: ScheduleResponse): string {
    const baseClass = 'p-3 rounded-lg cursor-pointer hover:opacity-80 transition-all duration-200 mb-3';

    if (meeting.scheduleId.toString() === this.selectedMeetingId) {
      return `${baseClass} bg-blue-600`;
    } else if (!meeting.isRead) {
      return `${baseClass} bg-yellow-600`;
    } else {
      return `${baseClass}`;
    }
  }
}
