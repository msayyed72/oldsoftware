import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskForEmpComponent } from './task-for-emp.component';

describe('TaskForEmpComponent', () => {
  let component: TaskForEmpComponent;
  let fixture: ComponentFixture<TaskForEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskForEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskForEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
