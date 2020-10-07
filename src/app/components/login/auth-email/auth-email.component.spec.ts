import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthEmailComponent } from './auth-email.component';

describe('AuthEmailComponent', () => {
  let component: AuthEmailComponent;
  let fixture: ComponentFixture<AuthEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
