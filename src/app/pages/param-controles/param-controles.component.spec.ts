import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamControlesComponent } from './param-controles.component';

describe('ParamControlesComponent', () => {
  let component: ParamControlesComponent;
  let fixture: ComponentFixture<ParamControlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ParamControlesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamControlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
