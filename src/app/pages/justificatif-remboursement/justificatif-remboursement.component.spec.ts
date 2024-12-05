import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificatifRemboursementComponent } from './justificatif-remboursement.component';

describe('JustificatifRemboursementComponent', () => {
  let component: JustificatifRemboursementComponent;
  let fixture: ComponentFixture<JustificatifRemboursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [JustificatifRemboursementComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JustificatifRemboursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
