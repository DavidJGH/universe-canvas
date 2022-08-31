import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionDisplayComponent } from './connection-display.component';

describe('ConnectionDisplayComponent', () => {
  let component: ConnectionDisplayComponent;
  let fixture: ComponentFixture<ConnectionDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectionDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
