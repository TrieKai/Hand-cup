import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkShopMapComponent } from './drink-shop-map.component';

describe('DrinkShopMapComponent', () => {
  let component: DrinkShopMapComponent;
  let fixture: ComponentFixture<DrinkShopMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrinkShopMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkShopMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
