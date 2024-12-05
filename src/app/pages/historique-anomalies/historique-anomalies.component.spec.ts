import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueAnomaliesComponent } from './historique-anomalies.component';

describe('HistoriqueAnomaliesComponent', () => {
  let component: HistoriqueAnomaliesComponent;
  let fixture: ComponentFixture<HistoriqueAnomaliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HistoriqueAnomaliesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueAnomaliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
