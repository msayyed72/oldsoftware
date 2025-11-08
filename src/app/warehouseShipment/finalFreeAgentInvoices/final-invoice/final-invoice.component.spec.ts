import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalInvoiceComponent } from './final-invoice.component';

describe('FinalInvoiceComponent', () => {
  let component: FinalInvoiceComponent;
  let fixture: ComponentFixture<FinalInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
