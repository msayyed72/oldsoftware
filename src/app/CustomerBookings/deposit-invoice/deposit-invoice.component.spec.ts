import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositInvoiceComponent } from './deposit-invoice.component';

describe('DepositInvoiceComponent', () => {
  let component: DepositInvoiceComponent;
  let fixture: ComponentFixture<DepositInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
