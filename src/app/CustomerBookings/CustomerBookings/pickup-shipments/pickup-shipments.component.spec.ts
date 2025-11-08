import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupShipmentsComponent } from './pickup-shipments.component';

describe('PickupShipmentsComponent', () => {
  let component: PickupShipmentsComponent;
  let fixture: ComponentFixture<PickupShipmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickupShipmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
