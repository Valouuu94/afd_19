import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHabilitationsComponent } from './admin-habilitations.component';

describe('AdminHabilitationsComponent', () => {
  let component: AdminHabilitationsComponent;
  let fixture: ComponentFixture<AdminHabilitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminHabilitationsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHabilitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
