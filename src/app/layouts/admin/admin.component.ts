import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit{
  activeMenuItem = '';
  currentUserEmail = '';
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserEmail = user?.email || 'manage@gmail.com';
  }
  onMenuItemSelected(menuItem: string) {
    this.activeMenuItem = menuItem;
  }

  onSignOut(): void {
    this.authService.logout();
  }
}
