import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationsONGviewComponent } from './donations-ongview.component';

describe('DonationsONGviewComponent', () => {
  let component: DonationsONGviewComponent;
  let fixture: ComponentFixture<DonationsONGviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationsONGviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationsONGviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
