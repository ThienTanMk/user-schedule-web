import { Component } from '@angular/core';
import { HistoryItem } from '../../shared/components/sidebar-management/sidebar-management.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  currentUserImage = '';
  currentUserEmail = 'admin@example.com';
  activeMenuItem = '';
  selectedConversation: HistoryItem | null = null;
  constructor(private authService: AuthService) {}
  onMenuItemSelected(menuItem: string) {
    console.log(menuItem);
    this.activeMenuItem = menuItem;
    this.selectedConversation = null;
  }

  onHistoryItemSelected(historyItem: HistoryItem) {
    this.selectedConversation = historyItem;
    this.activeMenuItem = '';
  }

  onSignOut(): void {
    this.authService.logout();
  }
}
