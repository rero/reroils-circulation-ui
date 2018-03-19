import { TestBed, inject } from '@angular/core/testing';

import { DocumentsService } from './documents.service';

describe('DocumentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentsService]
    });
  });

  it('should be created', inject([DocumentsService], (service: DocumentsService) => {
    expect(service).toBeTruthy();
  }));
});
