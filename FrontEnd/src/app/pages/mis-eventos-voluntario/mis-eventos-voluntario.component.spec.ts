import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEventosVoluntarioComponent } from './mis-eventos-voluntario.component';

describe('MisEventosVoluntarioComponent', () => {
  let component: MisEventosVoluntarioComponent;
  let fixture: ComponentFixture<MisEventosVoluntarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisEventosVoluntarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisEventosVoluntarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
