import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglementControlesComponent } from './reglement-controles.component';

describe('ReglementControlesComponent', () => {
  let component: ReglementControlesComponent;
  let fixture: ComponentFixture<ReglementControlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ReglementControlesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglementControlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
