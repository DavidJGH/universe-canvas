import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalableContainerComponent } from './scalable-container.component';

describe('ScalableContainerComponent', () => {
  let component: ScalableContainerComponent;
  let fixture: ComponentFixture<ScalableContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScalableContainerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScalableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
