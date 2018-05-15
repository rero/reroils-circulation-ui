import { TestBed, inject } from '@angular/core/testing';

import { InMemCirculationService } from './in-memory-circulation.service';

describe('InMemCirculationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemCirculationService]
    });
  });

  it('should be created', inject([InMemCirculationService], (service: InMemCirculationService) => {
    expect(service).toBeTruthy();
  }));
});
