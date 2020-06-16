import { TestBed } from '@angular/core/testing';

import { HtmlServiceService } from './html-service.service';

describe('HtmlServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HtmlServiceService = TestBed.get(HtmlServiceService);
    expect(service).toBeTruthy();
  });
});
