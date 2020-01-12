import { TestBed } from '@angular/core/testing';

import { RouterConstantsService } from './router-constants.service';

describe('RouterConstantsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouterConstantsService = TestBed.get(RouterConstantsService);
    expect(service).toBeTruthy();
  });
});
