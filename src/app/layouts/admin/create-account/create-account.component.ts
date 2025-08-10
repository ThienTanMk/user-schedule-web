import { ApiResponse } from './../../../core/models/api-response.model';
import { RoleRepresentation, RoleType } from './../../../core/models/role.model';
import { DepartmentResponse } from './../../../core/models/department.model';
import { UserResponse, UserCreationRequest } from './../../../core/models/user.model';
import { AuthService } from './../../../core/services/auth.service';
import { DepartmentService } from './../../../core/services/department.service';
import { Component, OnInit } from '@angular/core';

interface User {
  userId: number;
  keycloakId: string;
  username: string;
  firstname: string;
  lastname: string;
  dob: string;
  email: string;
  department: DepartmentResponse | null;
  role: RoleType;
}

@Component({
  selector: 'app-create-account',
  standalone: false,
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent implements OnInit {
  searchTerm: string = '';
  confirmPassword: string = '';
  departments: DepartmentResponse[] = [];
  users: User[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  RoleType = RoleType;
  newUser: UserCreationRequest & { role?: RoleType } = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    dob: '',
    email: '',
    departmentId: undefined,
    role: RoleType.USER
  };

  constructor(
    private departmentService: DepartmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadUsers();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (response: ApiResponse<DepartmentResponse[]>) => {
        if (response.data) {
          this.departments = response.data;
        } else {
          this.errorMessage = response.message || 'Không thể tải danh sách phòng ban';
        }
      },
    });
  }

  loadUsers(): void {
    this.users = [];
    this.authService.getUsers().subscribe({
      next: (userResponse: ApiResponse<UserResponse[]>) => {
        if (userResponse.data) {
          const userDate = userResponse.data;
          userDate.forEach(user => {
            this.authService.getRoleUser(user.keycloakId).subscribe({
              next: (roles: RoleRepresentation[]) => {
                const roleName = roles.map(r => r.name)
                let mappedRole: RoleType = RoleType.USER;//mac dinh neu ko co role
                if (roleName.includes(RoleType.ADMIN)) {
                  mappedRole = RoleType.ADMIN;
                } else if (roleName.includes(RoleType.MANAGER)) {
                  mappedRole =RoleType.MANAGER;
                }
                this.users.push({
                  ...user,
                  role: mappedRole
                });
              },
              error: err => {
                console.error('Lỗi lấy role cho user ${user.username}', err);
                this.users.push({
                  ...user,
                  role: RoleType.USER
                });
              }
            })
          })
        }else this.errorMessage = userResponse.message ||  'Không thể tải danh sách người dùng';
      },
    });
  }

  // determineUserRole(keycloakId: string): RoleType {
  //   const role = this.authService.getUserRole(keycloakId);
  //   return role || RoleType.USER;
  // }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidDate(dob: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dob)) return false;
    const date = new Date(dob);
    return date instanceof Date && !isNaN(date.getTime());
  }

  getValidationErrors(): string[] {
    const errors: string[] = [];

    if (!this.newUser.username?.trim()) {
      errors.push('Tên đăng nhập không được để trống');
    }

    if (!this.newUser.firstname?.trim()) {
      errors.push('Họ không được để trống');
    }

    if (!this.newUser.lastname?.trim()) {
      errors.push('Tên không được để trống');
    }

    if (!this.newUser.dob?.trim()) {
      errors.push('Ngày sinh không được để trống');
    } else if (!this.isValidDate(this.newUser.dob)) {
      errors.push('Ngày sinh không hợp lệ (định dạng: YYYY-MM-DD)');
    }

    if (!this.newUser.email?.trim()) {
      errors.push('Email không được để trống');
    } else if (!this.isValidEmail(this.newUser.email)) {
      errors.push('Email không hợp lệ');
    }

    if (!this.newUser.password?.trim()) {
      errors.push('Mật khẩu không được để trống');
    } else if (this.newUser.password.length < 8) {
      errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    }

    if (!this.confirmPassword?.trim()) {
      errors.push('Xác nhận mật khẩu không được để trống');
    } else if (this.newUser.password !== this.confirmPassword) {
      errors.push('Mật khẩu xác nhận không khớp');
    }

    if (this.newUser.departmentId === undefined || this.newUser.departmentId === null) {
      errors.push('Vui lòng chọn phòng ban');
    }

    if (!this.newUser.role) {
      errors.push('Vui lòng chọn vai trò');
    }

    return errors;
  }

  canCreateAccount(): boolean {
    console.log('Validation errors:', this.getValidationErrors());
    //return this.getValidationErrors().length === 0;
    return !!this.newUser.username?.trim() &&
         !!this.newUser.firstname?.trim() &&
         !!this.newUser.lastname?.trim() &&
         !!this.newUser.dob?.trim() &&
         !!this.newUser.email?.trim() &&
         !!this.newUser.password?.trim() &&
         !!this.confirmPassword?.trim() &&
         this.newUser.departmentId !== undefined &&
         this.newUser.departmentId !== null &&
         !!this.newUser.role;
  }

  createAccount(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const validationErrors = this.getValidationErrors();
    if (validationErrors.length > 0) {
      this.errorMessage = validationErrors.join('; ');
      window.alert('Lỗi: ' + this.errorMessage);
      return;
    }

    this.isLoading = true;

    const departmentId = typeof this.newUser.departmentId === 'string'
      ? parseInt(this.newUser.departmentId, 10)
      : this.newUser.departmentId;

    const userRequest: UserCreationRequest = {
      username: this.newUser.username.trim(),
      password: this.newUser.password,
      firstname: this.newUser.firstname.trim(),
      lastname: this.newUser.lastname.trim(),
      dob: this.newUser.dob,
      email: this.newUser.email.trim(),
      departmentId: departmentId
    };

    this.authService.registerUser(userRequest).subscribe({
      next: (response: ApiResponse<UserResponse>) => {

        if (response.data) {
          window.alert('Tạo tài khoản thành công');
          this.clearForm();
          this.loadUsers();
        } else {
          this.errorMessage = response.message || 'Lỗi khi tạo tài khoản - không có dữ liệu trả về';
          window.alert('Lỗi: ' + this.errorMessage);
        }
        this.isLoading = false;
      },
    });
  }

  clearForm(): void {
    this.newUser = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      dob: '',
      email: '',
      departmentId: undefined,
      role: RoleType.USER
    };
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  get filteredUsers(): User[] {
    if (!this.searchTerm) {
      return this.users;
    }
    return this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.firstname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
