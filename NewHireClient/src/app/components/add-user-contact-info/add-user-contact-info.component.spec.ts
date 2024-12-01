import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserContactInfoComponent } from './add-user-contact-info.component';

describe('AddUserContactInfoComponent', () => {
  let component: AddUserContactInfoComponent;
  let fixture: ComponentFixture<AddUserContactInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserContactInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
