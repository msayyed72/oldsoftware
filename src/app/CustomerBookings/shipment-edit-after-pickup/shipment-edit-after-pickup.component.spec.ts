import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentEditAfterPickupComponent } from './shipment-edit-after-pickup.component';

describe('ShipmentEditAfterPickupComponent', () => {
  let component: ShipmentEditAfterPickupComponent;
  let fixture: ComponentFixture<ShipmentEditAfterPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentEditAfterPickupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentEditAfterPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
