import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChosenCardComponent } from './chosen-card.component';

describe('ChosenCardComponent', () => {
  let component: ChosenCardComponent;
  let fixture: ComponentFixture<ChosenCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChosenCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChosenCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
