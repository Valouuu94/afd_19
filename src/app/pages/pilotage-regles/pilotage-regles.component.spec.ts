import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotageReglesComponent } from './pilotage-regles.component';

describe('PilotageReglesComponent', () => {
  let component: PilotageReglesComponent;
  let fixture: ComponentFixture<PilotageReglesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PilotageReglesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotageReglesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
