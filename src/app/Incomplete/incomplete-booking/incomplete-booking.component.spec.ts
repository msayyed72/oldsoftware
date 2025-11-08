import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompleteBookingComponent } from './incomplete-booking.component';

describe('IncompleteBookingComponent', () => {
  let component: IncompleteBookingComponent;
  let fixture: ComponentFixture<IncompleteBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncompleteBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncompleteBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
