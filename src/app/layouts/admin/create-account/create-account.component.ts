import { Component } from '@angular/core';
interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  createdDate: string;
}
@Component({
  selector: 'app-create-account',
  standalone: false,
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  searchTerm: string = '';
  confirmPassword: string = '';

  newUser = {
    fullName: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
    department: ''
  };

  users: User[] = [
    {
      id: 1,
      fullName: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'user',
      status: 'active',
      createdDate: '2025-07-20'
    },
    {
      id: 2,
      fullName: 'Trần Thị B',
      email: 'tranthib@example.com',
      role: 'admin',
      status: 'active',
      createdDate: '2025-07-19'
    },
    {
      id: 3,
      fullName: 'Lê Văn C',
      email: 'levanc@example.com',
      role: 'user',
      status: 'inactive',
      createdDate: '2025-07-18'
    }
  ];

  stats = {
    totalUsers: 156,
    activeUsers: 142,
    adminUsers: 8,
    newToday: 3
  };

  get filteredUsers(): User[] {
    if (!this.searchTerm) {
      return this.users;
    }

    return this.users.filter(user =>
      user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  canCreateAccount(): boolean {
    return this.newUser.fullName.trim() !== '' &&
           this.newUser.email.trim() !== '' &&
           this.isValidEmail(this.newUser.email) &&
           this.newUser.password.length >= 8 &&
           this.newUser.password === this.confirmPassword;
  }

  createAccount() {
    if (this.canCreateAccount()) {
      const user: User = {
        id: Date.now(),
        fullName: this.newUser.fullName,
        email: this.newUser.email,
        role: this.newUser.role,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0]
      };

      this.users.unshift(user);
      this.clearForm();

      console.log('Account created:', user);
    }
  }

  clearForm() {
    this.newUser = {
      fullName: '',
      email: '',
      password: '',
      role: 'user',
      department: ''
    };
    this.confirmPassword = '';
  }

  editUser(user: User) {
    console.log('Editing user:', user);
  }

  toggleUserStatus(user: User) {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    console.log('User status toggled:', user);
  }

  deleteUser(user: User) {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.users.splice(index, 1);
      console.log('User deleted:', user);
    }
  }
}
