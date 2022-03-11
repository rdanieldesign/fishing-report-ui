import { TestBed } from '@angular/core/testing';

import { MyEntryListViewService } from './my-entry-list-view.service';

describe('MyEntryListViewService', () => {
  let service: MyEntryListViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyEntryListViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
