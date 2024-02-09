import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccuntSettingsVoluntarioComponent } from './accunt-settings-voluntario.component';

describe('AccuntSettingsVoluntarioComponent', () => {
  let component: AccuntSettingsVoluntarioComponent;
  let fixture: ComponentFixture<AccuntSettingsVoluntarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccuntSettingsVoluntarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccuntSettingsVoluntarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
