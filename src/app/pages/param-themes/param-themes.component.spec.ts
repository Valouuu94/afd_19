import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamThemesComponent } from './param-themes.component';

describe('ParamThemesComponent', () => {
  let component: ParamThemesComponent;
  let fixture: ComponentFixture<ParamThemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ParamThemesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
