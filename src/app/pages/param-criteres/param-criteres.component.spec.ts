import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamCriteresComponent } from './param-criteres.component';

describe('ParamCriteresComponent', () => {
  let component: ParamCriteresComponent;
  let fixture: ComponentFixture<ParamCriteresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ParamCriteresComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamCriteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
