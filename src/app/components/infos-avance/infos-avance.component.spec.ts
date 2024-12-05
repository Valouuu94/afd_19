import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosAvanceComponent } from './infos-avance.component';

describe('InfosAvanceComponent', () => {
  let component: InfosAvanceComponent;
  let fixture: ComponentFixture<InfosAvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfosAvanceComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosAvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
