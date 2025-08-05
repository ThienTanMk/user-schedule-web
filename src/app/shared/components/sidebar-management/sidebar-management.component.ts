import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScheduleResponse } from '../../../core/models/schedule.model';

@Component({
  selector: 'app-sidebar-management',
  standalone: false,
  templateUrl: './sidebar-management.component.html',
  styleUrl: './sidebar-management.component.scss'
})
export class SidebarManagementComponent {
  @Input() userEmail: string = '';
  @Input() activeMenuItem: string = '';
  @Output() menuItemSelected = new EventEmitter<string>();
  @Output() signOutClicked = new EventEmitter<void>();

  selectedHistoryId: number | null = null;

  selectMenuItem(menuId: string) {
    this.selectedHistoryId = null;
    this.menuItemSelected.emit(menuId);
  }

  signOut() {
    this.signOutClicked.emit();
  }
}
