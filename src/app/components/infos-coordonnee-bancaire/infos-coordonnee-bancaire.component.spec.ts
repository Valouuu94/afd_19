import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosCoordonneBancaireComponent } from './infos-coordonnee-bancaire.component';

describe('InfosCoordonneBancaireComponent', () => {
  let component: InfosCoordonneBancaireComponent;
  let fixture: ComponentFixture<InfosCoordonneBancaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfosCoordonneBancaireComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosCoordonneBancaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
