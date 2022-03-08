import { TestBed } from '@angular/core/testing';

import { WordieService } from './wordie.service';

describe('WordieService', () => {
  let service: WordieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
