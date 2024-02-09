import { TestBed } from '@angular/core/testing';

import { ModalAddDonationService } from './modal-add-donation.service';

describe('ModalAddDonationService', () => {
  let service: ModalAddDonationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalAddDonationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
