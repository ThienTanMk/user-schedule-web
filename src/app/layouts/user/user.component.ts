import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  content: string;
  isRead: boolean;
}
@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
 currentUserImage: string = '';
  currentUserEmail: string = '';

 selectedMeeting: Meeting | null = null;
  showDetailSchedule: boolean = false;

  constructor(private authService: AuthService) {}

  onMeetingSelected(meeting: Meeting): void {
    this.selectedMeeting = meeting;
    this.showDetailSchedule = true;
  }

  onSignOut(): void {
    this.authService.logout();
  }

  onBackToMain(): void {
    this.showDetailSchedule = false;
    this.selectedMeeting = null;
  }
}
