import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueAnomaliesRajComponent } from './historique-anomalies-raj.component';

describe('HistoriqueAnomaliesRajComponent', () => {
  let component: HistoriqueAnomaliesRajComponent;
  let fixture: ComponentFixture<HistoriqueAnomaliesRajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HistoriqueAnomaliesRajComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueAnomaliesRajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
