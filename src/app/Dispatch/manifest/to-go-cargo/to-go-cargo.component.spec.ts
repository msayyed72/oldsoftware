import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToGoCargoComponent } from './to-go-cargo.component';

describe('ToGoCargoComponent', () => {
  let component: ToGoCargoComponent;
  let fixture: ComponentFixture<ToGoCargoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToGoCargoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToGoCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
