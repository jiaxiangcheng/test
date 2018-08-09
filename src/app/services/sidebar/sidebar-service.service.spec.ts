import { TestBed, inject } from '@angular/core/testing';

import { SidebarService } from './sidebar-service.service';

describe('SidebarServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidebarService]
    });
  });

  it('should be created', inject([SidebarService], (service: SidebarService) => {
    expect(service).toBeTruthy();
  }));
});
