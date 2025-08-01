import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layouts/login/login.component';
import { UserComponent } from './layouts/user/user.component';
import { UserDetailScheduleComponent } from './layouts/user/user-detail-schedule/user-detail-schedule.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { MailComponent } from './layouts/admin/mail/mail.component';
import { ScheduleComponent } from './layouts/admin/schedule/schedule.component';
import { CreateAccountComponent } from './layouts/admin/create-account/create-account.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo:'/login',
    pathMatch:'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    component: UserComponent,
    children: [
      { path: 'detail', component: UserDetailScheduleComponent },
    ],
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    component: AdminComponent,
    children: [
      { path: 'mail', component: MailComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'create-account', component: CreateAccountComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
