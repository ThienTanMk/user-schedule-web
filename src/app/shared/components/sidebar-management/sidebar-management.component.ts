import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConversationMessage } from '../../../layouts/admin/conversation-history/conversation-history.component';
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
}

export interface HistoryItem {
  id: number;
  title: string;
  date: string;
  type: string;
  messages?: ConversationMessage[];
}
@Component({
  selector: 'app-sidebar-management',
  standalone: false,
  templateUrl: './sidebar-management.component.html',
  styleUrl: './sidebar-management.component.scss'
})
export class SidebarManagementComponent {
 @Input() userImage: string = '';
  @Input() userEmail: string = '';
  @Input() activeMenuItem: string = '';
  @Output() menuItemSelected = new EventEmitter<string>();
  @Output() historyItemSelected = new EventEmitter<HistoryItem>();
  @Output() signOutClicked = new EventEmitter<void>();

  selectedHistoryId: number | null = null;

  historyItems: HistoryItem[] = [
    {
      id: 1,
      title: 'Email Campaign #1',
      date: '20/07/2025',
      type: 'Email',
      messages: [
        { text: 'Title: Email Marketing Campaign\ntới người nhận: team@company.com\nnội dung: Kế hoạch marketing tháng 8', isUser: true, timestamp: '14:30' },
        { text: 'Tôi đã tạo email campaign cho bạn. Email sẽ được gửi đến team@company.com với nội dung về kế hoạch marketing tháng 8.', isUser: false, timestamp: '14:31' }
      ]
    },
    {
      id: 2,
      title: 'Team Meeting Setup',
      date: '19/07/2025',
      type: 'Schedule',
      messages: [
        { text: 'Title: Weekly Team Meeting\ntới người nhận: all-staff@company.com\nthời gian: 25/07/2025 09:00\nnội dung: Họp team hàng tuần', isUser: true, timestamp: '10:15' },
        { text: 'Đã lên lịch họp thành công. Cuộc họp "Weekly Team Meeting" sẽ diễn ra vào 25/07/2025 lúc 09:00 với all-staff@company.com.', isUser: false, timestamp: '10:16' }
      ]
    },
    {
      id: 3,
      title: 'New User Account',
      date: '18/07/2025',
      type: 'Account',
      messages: [
        { text: 'Tạo tài khoản mới cho nhân viên John Doe', isUser: true, timestamp: '16:20' },
        { text: 'Tài khoản đã được tạo thành công cho John Doe. Thông tin đăng nhập đã được gửi qua email.', isUser: false, timestamp: '16:21' }
      ]
    },
    {
      id: 4,
      title: 'Monthly Report Email',
      date: '17/07/2025',
      type: 'Email',
      messages: [
        { text: 'Title: Báo cáo tháng 7\ntới người nhận: manager@company.com\nnội dung: Tổng kết hoạt động tháng 7/2025', isUser: true, timestamp: '11:45' },
        { text: 'Email báo cáo tháng 7 đã được soạn và gửi đến manager@company.com thành công.', isUser: false, timestamp: '11:46' }
      ]
    },
     {
      id: 5,
      title: 'Monthly Report Email',
      date: '17/07/2025',
      type: 'Email',
      messages: [
        { text: 'Title: Báo cáo tháng 7\ntới người nhận: manager@company.com\nnội dung: Tổng kết hoạt động tháng 7/2025', isUser: true, timestamp: '11:45' },
        { text: 'Email báo cáo tháng 7 đã được soạn và gửi đến manager@company.com thành công.', isUser: false, timestamp: '11:46' }
      ]
    },
     {
      id: 6,
      title: 'Monthly Report Email',
      date: '17/07/2025',
      type: 'Email',
      messages: [
        { text: 'Title: Báo cáo tháng 7\ntới người nhận: manager@company.com\nnội dung: Tổng kết hoạt động tháng 7/2025', isUser: true, timestamp: '11:45' },
        { text: 'Email báo cáo tháng 7 đã được soạn và gửi đến manager@company.com thành công.', isUser: false, timestamp: '11:46' }
      ]
    },
     {
      id: 7,
      title: 'Monthly Report Email',
      date: '17/07/2025',
      type: 'Email',
      messages: [
        { text: 'Title: Báo cáo tháng 7\ntới người nhận: manager@company.com\nnội dung: Tổng kết hoạt động tháng 7/2025', isUser: true, timestamp: '11:45' },
        { text: 'Email báo cáo tháng 7 đã được soạn và gửi đến manager@company.com thành công.', isUser: false, timestamp: '11:46' }
      ]
    },
     {
      id: 8,
      title: 'Monthly Report Email',
      date: '17/07/2025',
      type: 'Email',
      messages: [
        { text: 'Title: Báo cáo tháng 7\ntới người nhận: manager@company.com\nnội dung: Tổng kết hoạt động tháng 7/2025', isUser: true, timestamp: '11:45' },
        { text: 'Email báo cáo tháng 7 đã được soạn và gửi đến manager@company.com thành công.', isUser: false, timestamp: '11:46' }
      ]
    },
     {
      id: 9,
      title: 'Monthly Report Email',
      date: '17/07/2025',
      type: 'Email',
      messages: [
        { text: 'Title: Báo cáo tháng 7\ntới người nhận: manager@company.com\nnội dung: Tổng kết hoạt động tháng 7/2025', isUser: true, timestamp: '11:45' },
        { text: 'Email báo cáo tháng 7 đã được soạn và gửi đến manager@company.com thành công.', isUser: false, timestamp: '11:46' }
      ]
    },
     {
      id: 10,
      title: 'Monthly Report Email',
      date: '17/07/2025',
      type: 'Email',
      messages: [
        { text: 'Title: Báo cáo tháng 7\ntới người nhận: manager@company.com\nnội dung: Tổng kết hoạt động tháng 7/2025', isUser: true, timestamp: '11:45' },
        { text: 'Email báo cáo tháng 7 đã được soạn và gửi đến manager@company.com thành công.', isUser: false, timestamp: '11:46' }
      ]
    },
     {
      id:11,
      title: 'Monthly Report Email',
      date: '17/07/2025',
      type: 'Email',
      messages: [
        { text: 'Title: Báo cáo tháng 7\ntới người nhận: manager@company.com\nnội dung: Tổng kết hoạt động tháng 7/2025', isUser: true, timestamp: '11:45' },
        { text: 'Email báo cáo tháng 7 đã được soạn và gửi đến manager@company.com thành công.', isUser: false, timestamp: '11:46' }
      ]
    }
  ];

  selectMenuItem(menuId: string) {
    this.selectedHistoryId = null;
    this.menuItemSelected.emit(menuId);
  }

  selectHistoryItem(item: HistoryItem) {
    this.selectedHistoryId = item.id;
    this.historyItemSelected.emit(item);
  }

  signOut() {
    this.signOutClicked.emit();
  }
}
