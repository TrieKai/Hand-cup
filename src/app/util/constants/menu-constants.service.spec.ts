import { TestBed } from '@angular/core/testing';

import { MenuConstantsService } from './menu-constants.service';

describe('MenuConstantsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuConstantsService = TestBed.get(MenuConstantsService);
    expect(service).toBeTruthy();
  });
});
