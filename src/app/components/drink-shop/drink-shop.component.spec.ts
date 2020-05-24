import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkShopComponent } from './drink-shop.component';

describe('DrinkShopComponent', () => {
  let component: DrinkShopComponent;
  let fixture: ComponentFixture<DrinkShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrinkShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
