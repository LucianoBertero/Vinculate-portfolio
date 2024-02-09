import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadIncriptosEventoOngComponent } from './cantidad-incriptos-evento-ong.component';

describe('CantidadIncriptosEventoOngComponent', () => {
  let component: CantidadIncriptosEventoOngComponent;
  let fixture: ComponentFixture<CantidadIncriptosEventoOngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CantidadIncriptosEventoOngComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantidadIncriptosEventoOngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
