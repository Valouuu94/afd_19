import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersementReglementsComponent } from './versement-reglements.component';

describe('VersementReglementsComponent', () => {
  let component: VersementReglementsComponent;
  let fixture: ComponentFixture<VersementReglementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VersementReglementsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersementReglementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
