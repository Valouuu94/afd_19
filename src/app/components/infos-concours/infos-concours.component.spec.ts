import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosConcoursComponent } from './infos-concours.component';

describe('InfosConcoursComponent', () => {
  let component: InfosConcoursComponent;
  let fixture: ComponentFixture<InfosConcoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfosConcoursComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosConcoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
