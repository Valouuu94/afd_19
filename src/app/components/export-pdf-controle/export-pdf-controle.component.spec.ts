import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPdfControleComponent } from './export-pdf-controle.component';

describe('ExportPdfControleComponent', () => {
  let component: ExportPdfControleComponent;
  let fixture: ComponentFixture<ExportPdfControleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ExportPdfControleComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportPdfControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
