import { TestBed, inject } from '@angular/core/testing';

import { InMemoryCirculationServiceService } from './in-memory-circulation.service';

describe('InMemoryCirculationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemCirculationService]
    });
  });

  it('should be created', inject([InMemCirculationService], (service: InMemoryCiruclationService) => {
    expect(service).toBeTruthy();
  }));
});
