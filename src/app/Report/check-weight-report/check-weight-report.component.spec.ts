import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckWeightReportComponent } from './check-weight-report.component';

describe('CheckWeightReportComponent', () => {
  let component: CheckWeightReportComponent;
  let fixture: ComponentFixture<CheckWeightReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckWeightReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckWeightReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
