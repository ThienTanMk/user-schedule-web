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
  let message = 'Đã có lỗi xảy ra, vui lòng thử lại';

  const errCode = error.error?.statusCode;

  switch (errCode) {
    case 2200: // UNAUTHENTICATED
      message = 'Tên đăng nhập hoặc mật khẩu không đúng';
      break;
    case 2201: // UNAUTHORIZED
      message = 'Bạn không có quyền truy cập';
      break;
    case 0: // Không kết nối server
      message = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      break;
    case 2999: // UNCATEGORIZED
      message = 'Lỗi server. Vui lòng thử lại sau.';
      break;
    default:
      if (error.error?.message) {
        message = error.error.message;
      }
  }
  this.errorMessage = message;
  alert(message);
}


  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.authService.isManager()) {
      this.router.navigate(['/manager']);
    } else if (this.authService.isUser()) {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
