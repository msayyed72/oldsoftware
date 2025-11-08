import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalInvoiceModifyComponent } from './final-invoice-modify.component';

describe('FinalInvoiceModifyComponent', () => {
  let component: FinalInvoiceModifyComponent;
  let fixture: ComponentFixture<FinalInvoiceModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalInvoiceModifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalInvoiceModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
