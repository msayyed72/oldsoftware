import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPackageImageComponent } from './add-package-image.component';

describe('AddPackageImageComponent', () => {
  let component: AddPackageImageComponent;
  let fixture: ComponentFixture<AddPackageImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPackageImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPackageImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
