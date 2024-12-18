import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachesComponent } from './taches.component';

describe('TachesComponent', () => {
  let component: TachesComponent;
  let fixture: ComponentFixture<TachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TachesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
