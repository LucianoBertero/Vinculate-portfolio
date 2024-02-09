import { TestBed } from '@angular/core/testing';

import { ModifyDonationsService } from './modify-donations.service';

describe('ModifyDonationsService', () => {
  let service: ModifyDonationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifyDonationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
