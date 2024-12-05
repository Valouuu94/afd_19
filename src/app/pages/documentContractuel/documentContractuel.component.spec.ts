import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentContractuelComponent } from './documentContractuel.component';

describe('ReglementComponent', () => {
  let component: DocumentContractuelComponent;
  let fixture: ComponentFixture<DocumentContractuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DocumentContractuelComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentContractuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
