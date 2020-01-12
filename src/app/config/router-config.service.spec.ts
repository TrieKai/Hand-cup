import { TestBed } from '@angular/core/testing';

import { RouterConfigService } from './router-config.service';

describe('RouterConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouterConfigService = TestBed.get(RouterConfigService);
    expect(service).toBeTruthy();
  });
});
