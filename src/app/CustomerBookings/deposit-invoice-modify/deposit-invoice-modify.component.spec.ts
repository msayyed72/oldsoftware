import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositInvoiceModifyComponent } from './deposit-invoice-modify.component';

describe('DepositInvoiceModifyComponent', () => {
  let component: DepositInvoiceModifyComponent;
  let fixture: ComponentFixture<DepositInvoiceModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositInvoiceModifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositInvoiceModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
