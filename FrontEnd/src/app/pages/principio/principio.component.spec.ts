import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipioComponent } from './principio.component';

describe('PrincipioComponent', () => {
  let component: PrincipioComponent;
  let fixture: ComponentFixture<PrincipioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrincipioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
