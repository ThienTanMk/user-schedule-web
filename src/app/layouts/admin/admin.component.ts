import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit{
  activeMenuItem = '';
  currentUserEmail = '';
  constructor(
    private authService: AuthService,
    private router: Router) {}
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserEmail = user?.email || 'admin@gmail.com';
    const savedMenu = localStorage.getItem('activeMenuItem');
    this.activeMenuItem = savedMenu || 'agent';
  }
  onMenuItemSelected(menuItem: string) {
    if (menuItem === 'calendar') {
      this.router.navigate(['/user'], {state: {fromAdmin: true}});
    } else {
      this.activeMenuItem = menuItem;
      localStorage.setItem('activeMenuItem', menuItem);
    }
  }

  onSignOut(): void {
    this.authService.logout();
    localStorage.removeItem('activeMenuItem')
  }
}
