import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarManagementComponent } from './components/sidebar-management/sidebar-management.component';
import { SidebarUserComponent } from './components/sidebar-user/sidebar-user.component';



@NgModule({
  declarations: [
    SidebarManagementComponent,
    SidebarUserComponent
  ],
  imports: [
    CommonModule
  ],
   exports: [
    SidebarManagementComponent,
    SidebarUserComponent
  ],
})
export class SharedModule { }
