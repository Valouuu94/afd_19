import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersementControlesComponent } from './versement-controles.component';

describe('VersementControlesComponent', () => {
  let component: VersementControlesComponent;
  let fixture: ComponentFixture<VersementControlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VersementControlesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersementControlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
