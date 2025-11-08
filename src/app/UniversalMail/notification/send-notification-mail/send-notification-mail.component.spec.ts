import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNotificationMailComponent } from './send-notification-mail.component';

describe('SendNotificationMailComponent', () => {
  let component: SendNotificationMailComponent;
  let fixture: ComponentFixture<SendNotificationMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendNotificationMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendNotificationMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
