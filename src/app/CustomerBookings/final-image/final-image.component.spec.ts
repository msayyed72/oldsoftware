import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalImageComponent } from './final-image.component';

describe('FinalImageComponent', () => {
  let component: FinalImageComponent;
  let fixture: ComponentFixture<FinalImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
