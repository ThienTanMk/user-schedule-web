import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ScheduleResponse } from '../../core/models/schedule.model';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  currentUserEmail: string = '';
  selectedMeeting: ScheduleResponse | null = null;
  showDetailSchedule: boolean = false;
  activeMenuItem: string = '';
  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserEmail = user?.email || 'user@gmail.com';
  }

  onSignOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onMeetingSelected(meeting: ScheduleResponse): void {
    this.selectedMeeting = meeting;
    this.showDetailSchedule = true;
    this.activeMenuItem = '';
  }

  onBackToMain(): void {
    this.showDetailSchedule = false;
    this.selectedMeeting = null;
  }

  onMenuItemSelected(menuItem: string): void {
    this.activeMenuItem = menuItem;
    this.selectedMeeting = null;
  }
}
