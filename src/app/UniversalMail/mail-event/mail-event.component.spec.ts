import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailEventComponent } from './mail-event.component';

describe('MailEventComponent', () => {
  let component: MailEventComponent;
  let fixture: ComponentFixture<MailEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
