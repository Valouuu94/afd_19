import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAvanceComponent } from './type-avance.component';

describe('TypeAvanceComponent', () => {
  let component: TypeAvanceComponent;
  let fixture: ComponentFixture<TypeAvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TypeAvanceComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeAvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
