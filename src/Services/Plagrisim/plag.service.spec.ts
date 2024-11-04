import { TestBed } from '@angular/core/testing';

import { PlagService } from './plag.service';

describe('PlagService', () => {
  let service: PlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
