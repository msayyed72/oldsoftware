import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaggedShipmentReportComponent } from './bagged-shipment-report.component';

describe('BaggedShipmentReportComponent', () => {
  let component: BaggedShipmentReportComponent;
  let fixture: ComponentFixture<BaggedShipmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaggedShipmentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaggedShipmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
