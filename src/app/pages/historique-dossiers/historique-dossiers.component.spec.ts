import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDossiersComponent } from './historique-dossiers.component';

describe('HistoriqueDossiersComponent', () => {
  let component: HistoriqueDossiersComponent;
  let fixture: ComponentFixture<HistoriqueDossiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HistoriqueDossiersComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueDossiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
