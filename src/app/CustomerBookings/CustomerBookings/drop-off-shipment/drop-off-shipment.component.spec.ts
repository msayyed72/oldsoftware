import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropOffShipmentComponent } from './drop-off-shipment.component';

describe('DropOffShipmentComponent', () => {
  let component: DropOffShipmentComponent;
  let fixture: ComponentFixture<DropOffShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropOffShipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropOffShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
