import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingMailReportComponent } from './tracking-mail-report.component';

describe('TrackingMailReportComponent', () => {
  let component: TrackingMailReportComponent;
  let fixture: ComponentFixture<TrackingMailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingMailReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingMailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
