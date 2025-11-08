import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingStoackComponent } from './pending-stoack.component';

describe('PendingStoackComponent', () => {
  let component: PendingStoackComponent;
  let fixture: ComponentFixture<PendingStoackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingStoackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingStoackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
