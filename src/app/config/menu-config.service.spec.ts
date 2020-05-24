import { TestBed } from '@angular/core/testing';

import { MenuConfigService } from './menu-config.service';

describe('MenuConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuConfigService = TestBed.get(MenuConfigService);
    expect(service).toBeTruthy();
  });
});
