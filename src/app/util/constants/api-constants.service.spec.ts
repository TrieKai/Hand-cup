import { TestBed } from '@angular/core/testing';

import { ApiConstantsService } from './api-constants.service';

describe('ApiConstantsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiConstantsService = TestBed.get(ApiConstantsService);
    expect(service).toBeTruthy();
  });
});
