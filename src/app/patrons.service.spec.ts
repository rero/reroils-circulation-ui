import { TestBed, inject } from '@angular/core/testing';

import { PatronsService } from './patrons.service';

describe('PatronsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatronsService]
    });
  });

  it('should be created', inject([PatronsService], (service: PatronsService) => {
    expect(service).toBeTruthy();
  }));
});
