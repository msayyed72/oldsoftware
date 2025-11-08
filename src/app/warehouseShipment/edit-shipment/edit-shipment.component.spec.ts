import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShipmentComponent } from './edit-shipment.component';

describe('EditShipmentComponent', () => {
  let component: EditShipmentComponent;
  let fixture: ComponentFixture<EditShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditShipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
