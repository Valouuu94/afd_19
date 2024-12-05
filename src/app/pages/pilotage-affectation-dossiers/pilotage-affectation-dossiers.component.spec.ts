import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotageAffectationDossiersComponent } from './pilotage-affectation-dossiers.component';

describe('PilotageAffectationDossiersComponent', () => {
  let component: PilotageAffectationDossiersComponent;
  let fixture: ComponentFixture<PilotageAffectationDossiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PilotageAffectationDossiersComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotageAffectationDossiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
