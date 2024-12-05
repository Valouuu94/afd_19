import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBeneficiaireComponent } from './select-beneficiaire.component';

describe('SelectBeneficiaireComponent', () => {
  let component: SelectBeneficiaireComponent;
  let fixture: ComponentFixture<SelectBeneficiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SelectBeneficiaireComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBeneficiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
