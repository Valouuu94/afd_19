import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubriquesComponent } from './rubriques.component';

describe('ContentComponent', () => {
  let component: RubriquesComponent;
  let fixture: ComponentFixture<RubriquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RubriquesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubriquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
