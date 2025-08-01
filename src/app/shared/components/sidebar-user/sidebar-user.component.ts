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
  selector: 'app-sidebar-user',
  standalone: false,
  templateUrl: './sidebar-user.component.html',
  styleUrl: './sidebar-user.component.scss'
})
export class SidebarUserComponent {
 @Input() userImage: string = '';
  @Input() userEmail: string = '';
  @Output() meetingSelected = new EventEmitter<Meeting>();
  @Output() signOutClicked = new EventEmitter<void>();
  showMeetingHistory: boolean = true;
  selectedMeetingId: string = '';
  meetingHistory: Meeting[] = [
    {
      id: '1',
      title: 'Cuộc họp dự án A',
      date: '23/07/2025',
      time: '09:00 - 10:30',
      content: 'Thảo luận về tiến độ dự án và phân công nhiệm vụ cho tuần tới.',
      isRead: false
    },
    {
      id: '2',
      title: 'Họp team Marketing',
      date: '22/07/2025',
      time: '14:00 - 15:00',
      content: 'Đánh giá chiến dịch marketing Q3 và lên kế hoạch cho Q4.',
      isRead: true
    },
    {
      id: '3',
      title: 'Cuộc họp với khách hàng',
      date: '21/07/2025',
      time: '10:00 - 11:30',
      content: 'Thuyết trình sản phẩm mới và thảo luận yêu cầu của khách hàng.',
      isRead: false
    }
  ];

  toggleMeetingHistory(): void {
    this.showMeetingHistory = !this.showMeetingHistory;
  }

  selectMeeting(meeting: Meeting): void {
    this.selectedMeetingId = meeting.id;
    meeting.isRead = true;
    this.meetingSelected.emit(meeting);
  }

  signOut(): void {
    this.signOutClicked.emit();
  }

  getMeetingItemClass(meeting: Meeting): string {
    const baseClass = 'p-3 rounded-lg cursor-pointer hover:opacity-80 transition-all duration-200 mb-3';

    if (meeting.id === this.selectedMeetingId) {
      return `${baseClass} bg-blue-600`;
    } else if (!meeting.isRead) {
      return `${baseClass} bg-yellow-600`;
    } else {
      return `${baseClass}`;
    }
  }
}
