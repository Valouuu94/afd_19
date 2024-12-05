import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurAdhesionComponent } from './utilisateur-adhesion.component';

describe('UtilisateurAdhesionComponent', () => {
  let component: UtilisateurAdhesionComponent;
  let fixture: ComponentFixture<UtilisateurAdhesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UtilisateurAdhesionComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilisateurAdhesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
