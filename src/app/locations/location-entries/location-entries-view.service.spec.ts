import { TestBed } from '@angular/core/testing';

import { LocationEntriesViewService } from './location-entries-view.service';

describe('LocationEntriesViewService', () => {
  let service: LocationEntriesViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationEntriesViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
