import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnMenuComponent } from './btnMenu.component';

describe('BtnComponent', () => {
  let component: BtnMenuComponent;
  let fixture: ComponentFixture<BtnMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BtnMenuComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
