import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersementsComponent } from './versements.component';

describe('VersementsComponent', () => {
  let component: VersementsComponent;
  let fixture: ComponentFixture<VersementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VersementsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
