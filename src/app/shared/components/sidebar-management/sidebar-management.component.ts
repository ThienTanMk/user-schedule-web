import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScheduleResponse } from '../../../core/models/schedule.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-management',
  standalone: false,
  templateUrl: './sidebar-management.component.html',
  styleUrl: './sidebar-management.component.scss'
})
export class SidebarManagementComponent implements OnInit{
  @Input() userEmail: string = '';
  @Input() activeMenuItem: string = '';
  @Output() menuItemSelected = new EventEmitter<string>();
  @Output() signOutClicked = new EventEmitter<void>();
  isManager: boolean = false;
  selectedHistoryId: number | null = null;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.isManager = this.authService.isManager() && !this.authService.isAdmin();
  }

  selectMenuItem(menuId: string) {
    if (menuId === 'create-account' && this.isManager) {
      return;
    }
    this.selectedHistoryId = null;
    this.menuItemSelected.emit(menuId);
  }

  signOut() {
    this.signOutClicked.emit();
  }
}
