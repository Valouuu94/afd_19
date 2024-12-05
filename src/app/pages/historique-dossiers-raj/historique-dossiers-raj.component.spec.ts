import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriqueDossiersRajComponent } from './historique-dossiers-raj.component';

describe('HistoriqueDossiersRajComponent', () => {
  let component: HistoriqueDossiersRajComponent;
  let fixture: ComponentFixture<HistoriqueDossiersRajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HistoriqueDossiersRajComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueDossiersRajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
