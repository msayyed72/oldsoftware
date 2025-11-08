import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpdReportComponent } from './npd-report.component';

describe('NpdReportComponent', () => {
  let component: NpdReportComponent;
  let fixture: ComponentFixture<NpdReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpdReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
