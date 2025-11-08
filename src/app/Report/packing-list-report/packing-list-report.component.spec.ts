import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingListReportComponent } from './packing-list-report.component';

describe('PackingListReportComponent', () => {
  let component: PackingListReportComponent;
  let fixture: ComponentFixture<PackingListReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingListReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackingListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
