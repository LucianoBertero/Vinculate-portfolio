import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEventosOngComponent } from './mis-eventos-ong.component';

describe('MisEventosOngComponent', () => {
  let component: MisEventosOngComponent;
  let fixture: ComponentFixture<MisEventosOngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisEventosOngComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisEventosOngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
