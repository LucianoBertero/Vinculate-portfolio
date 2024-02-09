import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarOrganizacionesComponent } from './buscar-organizaciones.component';

describe('BuscarOrganizacionesComponent', () => {
  let component: BuscarOrganizacionesComponent;
  let fixture: ComponentFixture<BuscarOrganizacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarOrganizacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarOrganizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
