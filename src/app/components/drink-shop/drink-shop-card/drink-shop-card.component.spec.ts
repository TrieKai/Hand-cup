import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkShopCardComponent } from './drink-shop-card.component';

describe('DrinkShopCardComponent', () => {
  let component: DrinkShopCardComponent;
  let fixture: ComponentFixture<DrinkShopCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrinkShopCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkShopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
