import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContreValeurComponent } from './contre-valeur.component';

describe('ContreValeurComponent', () => {
  let component: ContreValeurComponent;
  let fixture: ComponentFixture<ContreValeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContreValeurComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContreValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
