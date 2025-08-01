import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarManagementComponent } from './sidebar-management.component';

describe('SidebarManagementComponent', () => {
  let component: SidebarManagementComponent;
  let fixture: ComponentFixture<SidebarManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
