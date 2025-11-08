import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckWeightComponent } from './check-weight.component';

describe('CheckWeightComponent', () => {
  let component: CheckWeightComponent;
  let fixture: ComponentFixture<CheckWeightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckWeightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
