import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotagePerimetreComponent } from './pilotage-perimetre.component';

describe('PilotagePerimetreComponent', () => {
  let component: PilotagePerimetreComponent;
  let fixture: ComponentFixture<PilotagePerimetreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PilotagePerimetreComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotagePerimetreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
