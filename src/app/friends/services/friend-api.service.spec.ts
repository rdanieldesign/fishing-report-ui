import { TestBed } from '@angular/core/testing';

import { FriendApiService } from './friend-api.service';

describe('FriendApiService', () => {
  let service: FriendApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
