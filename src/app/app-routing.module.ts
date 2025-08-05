import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layouts/login/login.component';
import { UserComponent } from './layouts/user/user.component';
import { UserDetailScheduleComponent } from './layouts/user/user-detail-schedule/user-detail-schedule.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { CreateAccountComponent } from './layouts/admin/create-account/create-account.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { ManagerGuard } from './core/guards/manager.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    component: UserComponent,
    children: [{ path: 'detail', component: UserDetailScheduleComponent }],
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    component: AdminComponent,
    children: [{ path: 'create-account', component: CreateAccountComponent }],
  },
  {
    path: 'manager',
    canActivate: [ManagerGuard],
    component: AdminComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
