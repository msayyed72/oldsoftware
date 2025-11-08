import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawbBaggingComponent } from './hawb-bagging.component';

describe('HawbBaggingComponent', () => {
  let component: HawbBaggingComponent;
  let fixture: ComponentFixture<HawbBaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawbBaggingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HawbBaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
