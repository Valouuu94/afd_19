import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosVersementComponent } from './infos-versement.component';

describe('InfosVersementComponent', () => {
  let component: InfosVersementComponent;
  let fixture: ComponentFixture<InfosVersementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfosVersementComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosVersementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
