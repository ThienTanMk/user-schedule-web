import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConversationHistoryComponent } from './layouts/admin/conversation-history/conversation-history.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { LoginComponent } from './layouts/login/login.component';
import { UserComponent } from './layouts/user/user.component';
import { UserDetailScheduleComponent } from './layouts/user/user-detail-schedule/user-detail-schedule.component';
import { CreateAccountComponent } from './layouts/admin/create-account/create-account.component';
import { MailComponent } from './layouts/admin/mail/mail.component';
import { ScheduleComponent } from './layouts/admin/schedule/schedule.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    ConversationHistoryComponent,
    AdminComponent,
    LoginComponent,
    UserComponent,
    UserDetailScheduleComponent,
    CreateAccountComponent,
    MailComponent,
    ScheduleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
