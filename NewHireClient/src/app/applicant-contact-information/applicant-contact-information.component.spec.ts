import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantContactInformationComponent } from './applicant-contact-information.component';

describe('ApplicantContactInformationComponent', () => {
  let component: ApplicantContactInformationComponent;
  let fixture: ComponentFixture<ApplicantContactInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantContactInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantContactInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
