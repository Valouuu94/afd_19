import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosReglementComponent } from './infos-reglement.component';

describe('InfosReglementComponent', () => {
  let component: InfosReglementComponent;
  let fixture: ComponentFixture<InfosReglementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfosReglementComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
