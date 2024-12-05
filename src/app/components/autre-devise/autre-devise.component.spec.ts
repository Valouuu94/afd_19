import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutreDeviseComponent } from './autre-devise.component';

describe('AutreDeviseComponent', () => {
  let component: AutreDeviseComponent;
  let fixture: ComponentFixture<AutreDeviseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AutreDeviseComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutreDeviseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
