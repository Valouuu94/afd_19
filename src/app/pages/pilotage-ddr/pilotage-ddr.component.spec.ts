import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotageDDRComponent } from './pilotage-ddr.component';

describe('PilotageDDRComponent', () => {
  let component: PilotageDDRComponent;
  let fixture: ComponentFixture<PilotageDDRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PilotageDDRComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotageDDRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
