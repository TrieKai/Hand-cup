import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockLoadingComponent } from './lock-loading.component';

describe('LockLoadingComponent', () => {
  let component: LockLoadingComponent;
  let fixture: ComponentFixture<LockLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
