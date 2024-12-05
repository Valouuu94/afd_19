import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosContextComponent } from './infos-context.component';

describe('InfosContextComponent', () => {
  let component: InfosContextComponent;
  let fixture: ComponentFixture<InfosContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfosContextComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
