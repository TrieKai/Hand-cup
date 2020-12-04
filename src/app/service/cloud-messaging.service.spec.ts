import { TestBed } from '@angular/core/testing';

import { CloudMessagingService } from './cloud-messaging.service';

describe('CloudMessagingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudMessagingService = TestBed.get(CloudMessagingService);
    expect(service).toBeTruthy();
  });
});
