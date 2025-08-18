import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarManagementComponent } from './components/sidebar-management/sidebar-management.component';
import { SidebarUserComponent } from './components/sidebar-user/sidebar-user.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { FormsModule } from '@angular/forms';
import { EditRoomComponent } from './components/edit-room/edit-room.component';



@NgModule({
  declarations: [
    SidebarManagementComponent,
    SidebarUserComponent,
    EditProfileComponent,
    EditRoomComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
   exports: [
    SidebarManagementComponent,
    SidebarUserComponent,
    EditProfileComponent,
    EditRoomComponent
  ],
})
export class SharedModule { }
