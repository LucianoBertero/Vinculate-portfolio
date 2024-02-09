import { TestBed } from '@angular/core/testing';

import { ProteccionInicioGuard } from './proteccion-inicio.guard';

describe('ProteccionInicioGuard', () => {
  let guard: ProteccionInicioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProteccionInicioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
