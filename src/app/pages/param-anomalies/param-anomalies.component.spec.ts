import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamAnomaliesComponent } from './param-anomalies.component';

describe('ParamAnomaliesComponent', () => {
  let component: ParamAnomaliesComponent;
  let fixture: ComponentFixture<ParamAnomaliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ParamAnomaliesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamAnomaliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
