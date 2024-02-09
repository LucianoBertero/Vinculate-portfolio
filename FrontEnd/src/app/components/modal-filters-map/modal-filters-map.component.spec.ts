import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFiltersMapComponent } from './modal-filters-map.component';

describe('ModalFiltersMapComponent', () => {
  let component: ModalFiltersMapComponent;
  let fixture: ComponentFixture<ModalFiltersMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFiltersMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFiltersMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
