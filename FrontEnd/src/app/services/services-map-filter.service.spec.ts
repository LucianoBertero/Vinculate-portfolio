import { TestBed } from '@angular/core/testing';

import { ServicesMapFilterService } from './services-map-filter.service';

describe('ServicesMapFilterService', () => {
  let service: ServicesMapFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesMapFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
