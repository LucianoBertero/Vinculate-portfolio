import { TestBed } from '@angular/core/testing';

import { ModalPasswordService } from './modal-password.service';

describe('ModalPasswordService', () => {
  let service: ModalPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
