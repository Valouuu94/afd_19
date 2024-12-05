import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUtilisateursComponent } from './admin-utilisateurs.component';

describe('AdminUtilisateursComponent', () => {
  let component: AdminUtilisateursComponent;
  let fixture: ComponentFixture<AdminUtilisateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminUtilisateursComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
