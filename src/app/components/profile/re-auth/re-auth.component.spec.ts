import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAuthComponent } from './re-auth.component';

describe('ReAuthComponent', () => {
  let component: ReAuthComponent;
  let fixture: ComponentFixture<ReAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
