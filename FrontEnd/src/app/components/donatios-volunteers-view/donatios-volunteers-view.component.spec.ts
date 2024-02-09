import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonatiosVolunteersViewComponent } from './donatios-volunteers-view.component';

describe('DonatiosVolunteersViewComponent', () => {
  let component: DonatiosVolunteersViewComponent;
  let fixture: ComponentFixture<DonatiosVolunteersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonatiosVolunteersViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonatiosVolunteersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
