import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, TokenResponse } from '../models/auth.model';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { JwtPayload } from '../models/jwt-payload.model';
import { ApiResponse } from '../models/api-response.model';
import { Router } from '@angular/router';
import { ChangePasswordRequest, UserCreationRequest, UserResponse, UserUpdateRequest } from '../models/user.model';
import { RoleType } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/users';
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(private http: HttpClient, private router: Router) { }

  login(request: LoginRequest): Observable<ApiResponse<TokenResponse>> {
    return this.http.post<ApiResponse<TokenResponse>>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        if (response.data.accessToken) {
          localStorage.setItem(this.tokenKey, response.data.accessToken);
          const decodedToken: JwtPayload | null = this.decodeToken();
          if (decodedToken) {
            const user = {
              keycloakId: decodedToken.sub,
              username: decodedToken.preferred_username,
              email: decodedToken.email,
              firstname: decodedToken.given_name,
              lastname: decodedToken.family_name
            };
            localStorage.setItem(this.userKey, JSON.stringify(user));
          }
        }
      }),
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      let payload = parts[1];
      payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      switch (payload.length % 4) {
        case 2: payload += '=='; break;
        case 3: payload += '='; break;
      }

      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (err) {
      console.error('Failed to decode JWT:', err);
      return null;
    }
  }

  getCurrentUser(): UserResponse | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getUserRole(keycloakId: string): RoleType | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken = this.decodeToken();
    if (decodedToken && decodedToken.sub === keycloakId) {
      const roles = decodedToken.realm_access?.roles || [];
      if (roles.includes(RoleType.ADMIN)) {
        return RoleType.ADMIN;
      } else if (roles.includes(RoleType.MANAGER)) {
        return RoleType.MANAGER;
      } else if (roles.includes(RoleType.USER)) {
        return RoleType.USER;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const decodedToken: JwtPayload | null = this.decodeToken();
    return decodedToken?.realm_access?.roles.includes('ADMIN') || false;
  }

  isUser(): boolean {
    const decodedToken: JwtPayload | null = this.decodeToken();
    return decodedToken?.realm_access?.roles.includes('USER') || false;
  }

  isManager(): boolean {
    const decodedToken: JwtPayload | null = this.decodeToken();
    return decodedToken?.realm_access?.roles.includes('MANAGER') || false;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  registerUser(request: UserCreationRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.post<ApiResponse<UserResponse>>(`${this.apiUrl}/register`, request);
  }

  getUsers(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/all`);
  }

  getMyProfile(): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/my-profile`);
  }

  getUser(keycloakId: string): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/${keycloakId}`);
  }

  updateProfile(keycloakId: string, request: UserUpdateRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(`${this.apiUrl}/${keycloakId}`, request);
  }

  changePassword(userId: string, request: ChangePasswordRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/change-password`, request);
  }
}
