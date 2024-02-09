import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOngComponent } from './profile-ong.component';

describe('ProfileOngComponent', () => {
  let component: ProfileOngComponent;
  let fixture: ComponentFixture<ProfileOngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileOngComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileOngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
