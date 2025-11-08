import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveItemEmailComponent } from './remove-item-email.component';

describe('RemoveItemEmailComponent', () => {
  let component: RemoveItemEmailComponent;
  let fixture: ComponentFixture<RemoveItemEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveItemEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveItemEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
