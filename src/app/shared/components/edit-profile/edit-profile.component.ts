import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChangePasswordRequest, DepartmentResponse, UserResponse, UserUpdateRequest } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { DepartmentService } from '../../../core/services/department.service';
import { ApiResponse } from '../../../core/models/api-response.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-profile',
  standalone: false,
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit{
  updateRequest: UserUpdateRequest = {
    firstname: '',
    lastname: '',
    dob: '',
    departmentId: undefined,
  };
  originalRequest: UserUpdateRequest = {
    firstname: '',
    lastname: '',
    dob: '',
    departmentId: undefined,
  };
  changePasswordRequest: ChangePasswordRequest = {
    oldPassword: '',
    newPassword: '',
  };
  departments: DepartmentResponse[] = [];
  loading = false;
  keycloakId: string | null = null;
  showChangePasswordForm = false;
  showOldPassword = false;
  showNewPassword = false;
  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.keycloakId = currentUser.keycloakId;
      const initialData: UserUpdateRequest = {
        firstname: currentUser.firstname || '',
        lastname: currentUser.lastname || '',
        dob: currentUser.dob || '',
        departmentId: currentUser.department?.departmentId
          ? Number(currentUser.department.departmentId)
          : undefined,
      };
      this.updateRequest = { ...initialData };
      this.originalRequest = { ...initialData };
    }

    this.departmentService.getAllDepartments().subscribe({
      next: (response: ApiResponse<DepartmentResponse[]>) => {
        this.departments = response.data || [];
      },
    });
  }

  hasChanges(): boolean {
    return (
      this.updateRequest.firstname !== this.originalRequest.firstname ||
      this.updateRequest.lastname !== this.originalRequest.lastname ||
      this.updateRequest.dob !== this.originalRequest.dob ||
      this.updateRequest.departmentId !== this.originalRequest.departmentId
    );
  }

  canSavePassword(): boolean {
    return Boolean(
      this.changePasswordRequest.oldPassword &&
      this.changePasswordRequest.newPassword &&
      this.changePasswordRequest.oldPassword !== this.changePasswordRequest.newPassword
    );
  }

  onSubmit(): void {
    if (!this.keycloakId) {
      alert('Lỗi: Không tìm thấy mã xác thực');
      return;
    }

    this.loading = true;
    this.authService.updateProfile(this.keycloakId, this.updateRequest).subscribe({
      next: (response: ApiResponse<UserResponse>) => {
        this.loading = false;
        const updatedUser: UserResponse = {
          ...response.data,
          department: this.departments.find(
            (d) => d.departmentId === String(this.updateRequest.departmentId)
          ) || response.data.department,
        };
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        this.originalRequest = { ...this.updateRequest };
        alert('Thành công: Cập nhật thông tin cá nhân thành công!');
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.error('Lỗi khi cập nhật hồ sơ:', error);
        let errorMessage = 'Lỗi: Không thể cập nhật thông tin. Chi tiết: Không xác định';
        if (error.error?.statusCode) {
          errorMessage = this.formatErrorMessage(error.error.statusCode, error.error.message);
        }
        alert(errorMessage);
      },
    });
  }

  cancelEdit(): void {
    this.updateRequest = { ...this.originalRequest };
  }

  openChangePasswordForm(): void {
    this.showChangePasswordForm = true;
    this.changePasswordRequest = { oldPassword: '', newPassword: '' };
  }

  closeChangePasswordForm(): void {
    this.showChangePasswordForm = false;
    this.changePasswordRequest = { oldPassword: '', newPassword: '' };
  }

  onChangePassword(): void {
    if (!this.keycloakId) {
      alert('Lỗi: Không tìm thấy keycloakId.');
      return;
    }

    this.loading = true;
    this.authService.changePassword(this.keycloakId, this.changePasswordRequest).subscribe({
      next: () => {
        this.loading = false;
        alert('Thành công: Đổi mật khẩu thành công!');
        this.closeChangePasswordForm();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.error('Lỗi khi đổi mật khẩu:', error);
        let errorMessage = 'Lỗi: Không thể đổi mật khẩu. Chi tiết: Không xác định';
        if (error.error?.statusCode) {
          errorMessage = this.formatErrorMessage(error.error.statusCode, error.error.message);
        }
        alert(errorMessage);
      },
    });
  }

  toggleShowOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  private formatErrorMessage(statusCode: number, message?: string): string {
    switch (statusCode) {
      case 2001: return 'Lỗi: Mật khẩu không được để trống.';
      case 2002: return `Lỗi: Mật khẩu phải có ít nhất 6 ký tự. ${message || ''}`;
      case 2003: return 'Lỗi: Họ không được để trống.';
      case 2004: return 'Lỗi: Tên không được để trống.';
      case 2005: return 'Lỗi: Ngày sinh không được để trống.';
      case 2006: return 'Lỗi: Ngày sinh phải là ngày trong quá khứ.';
      case 2025: return 'Lỗi: Mật khẩu mới không được để trống.';
      case 2026: return 'Lỗi: Mật khẩu cũ không được để trống.';
      case 2200: return 'Lỗi: Chưa xác thực.';
      case 2201: return 'Lỗi: Bạn không có quyền thực hiện hành động này.';
      case 2202: return 'Lỗi: Mật khẩu cũ không đúng. Vui lòng kiểm tra lại.';
      case 2999: return `Lỗi: Đã xảy ra lỗi không xác định. Chi tiết: ${message || 'Không xác định'}`;
      default: return `Lỗi: Đã xảy ra lỗi không xác định. Mã lỗi: ${statusCode}. Chi tiết: ${message || 'Không xác định'}`;
    }
  }
}
