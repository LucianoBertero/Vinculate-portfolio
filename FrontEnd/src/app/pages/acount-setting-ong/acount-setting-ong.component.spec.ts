import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcountSettingONGComponent } from './acount-setting-ong.component';

describe('AcountSettingONGComponent', () => {
  let component: AcountSettingONGComponent;
  let fixture: ComponentFixture<AcountSettingONGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcountSettingONGComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcountSettingONGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
