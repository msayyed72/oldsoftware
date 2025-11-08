import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToShipmentCompanyComponent } from './to-shipment-company.component';

describe('ToShipmentCompanyComponent', () => {
  let component: ToShipmentCompanyComponent;
  let fixture: ComponentFixture<ToShipmentCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToShipmentCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToShipmentCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
