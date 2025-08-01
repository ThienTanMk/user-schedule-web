import { Component, OnInit } from '@angular/core';
import {LoginRequest } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  user: LoginRequest = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  onSubmit(): void {
    if (!this.user.username || !this.user.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      username: this.user.username,
      password: this.user.password
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        if (response.data.accessToken) {
          this.redirectBasedOnRole();
        } else {
          this.errorMessage = response.message || 'Đăng nhập thất bại';
        }
      },
      error: (error) => {
        this.handleLoginError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleLoginError(error: any): void {
    if (error.error?.data?.code) {
      switch (error.error.data.code) {
        case 2200: // UNAUTHENTICATED
          this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
          break;
        case 0: // Không kết nối server
          this.errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
          break;
        case 2999: // UNCATEGORIZED
          this.errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
          break;
        default:
          this.errorMessage = error.error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại';
      }
    } else {
      this.errorMessage = 'Đã có lỗi xảy ra, vui lòng thử lại';
    }
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.authService.isUser()) {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
