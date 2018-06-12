import { TestBed, async, inject } from '@angular/core/testing';

import { ModificationGuard } from './modification.guard';

describe('ModificationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModificationGuard]
    });
  });

  it('should ...', inject([ModificationGuard], (guard: ModificationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
