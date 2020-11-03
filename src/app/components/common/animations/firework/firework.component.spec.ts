import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireworkComponent } from './firework.component';

describe('FireworkComponent', () => {
  let component: FireworkComponent;
  let fixture: ComponentFixture<FireworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
