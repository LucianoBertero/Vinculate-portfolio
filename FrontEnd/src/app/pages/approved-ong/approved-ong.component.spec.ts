import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedONGComponent } from './approved-ong.component';

describe('ApprovedONGComponent', () => {
  let component: ApprovedONGComponent;
  let fixture: ComponentFixture<ApprovedONGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedONGComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedONGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
