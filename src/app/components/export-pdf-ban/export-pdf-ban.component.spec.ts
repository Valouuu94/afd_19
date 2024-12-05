import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPdfBanComponent } from './export-pdf-ban.component';

describe('ExportPdfBanComponent', () => {
  let component: ExportPdfBanComponent;
  let fixture: ComponentFixture<ExportPdfBanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ExportPdfBanComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportPdfBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
