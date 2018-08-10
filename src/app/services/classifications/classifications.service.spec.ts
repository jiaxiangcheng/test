import { TestBed, inject } from '@angular/core/testing';

import { ClassificationsService } from './classifications.service';

describe('ClassificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassificationsService]
    });
  });

  it('should be created', inject([ClassificationsService], (service: ClassificationsService) => {
    expect(service).toBeTruthy();
  }));
});
