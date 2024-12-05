import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosDcComponent } from './infos-dc.component';

describe('InfosDcComponent', () => {
  let component: InfosDcComponent;
  let fixture: ComponentFixture<InfosDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfosDcComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
