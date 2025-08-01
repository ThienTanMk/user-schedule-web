import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailScheduleComponent } from './user-detail-schedule.component';

describe('UserDetailScheduleComponent', () => {
  let component: UserDetailScheduleComponent;
  let fixture: ComponentFixture<UserDetailScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDetailScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
