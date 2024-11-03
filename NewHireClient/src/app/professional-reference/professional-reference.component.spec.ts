import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalReferenceComponent } from './professional-reference.component';

describe('ProfessionalReferenceComponent', () => {
  let component: ProfessionalReferenceComponent;
  let fixture: ComponentFixture<ProfessionalReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
