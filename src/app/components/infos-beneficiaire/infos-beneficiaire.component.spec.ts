import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosBeneficiaireComponent } from './infos-beneficiaire.component';

describe('InfosBeneficiaireComponent', () => {
  let component: InfosBeneficiaireComponent;
  let fixture: ComponentFixture<InfosBeneficiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfosBeneficiaireComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosBeneficiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
