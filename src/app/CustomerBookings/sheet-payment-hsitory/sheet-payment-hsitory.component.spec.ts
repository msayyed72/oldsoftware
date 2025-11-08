import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetPaymentHsitoryComponent } from './sheet-payment-hsitory.component';

describe('SheetPaymentHsitoryComponent', () => {
  let component: SheetPaymentHsitoryComponent;
  let fixture: ComponentFixture<SheetPaymentHsitoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetPaymentHsitoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetPaymentHsitoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
