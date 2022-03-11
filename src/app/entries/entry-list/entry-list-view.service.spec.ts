import { TestBed } from '@angular/core/testing';

import { EntryListViewService } from './entry-list-view.service';

describe('EntryListViewService', () => {
  let service: EntryListViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntryListViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
