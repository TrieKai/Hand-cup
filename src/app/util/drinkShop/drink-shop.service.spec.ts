import { TestBed } from '@angular/core/testing';

import { DrinkShopService } from './drink-shop.service';

describe('DrinkShopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrinkShopService = TestBed.get(DrinkShopService);
    expect(service).toBeTruthy();
  });
});
