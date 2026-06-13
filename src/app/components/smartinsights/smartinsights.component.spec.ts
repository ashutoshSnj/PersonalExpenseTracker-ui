import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartinsightsComponent } from './smartinsights.component';

describe('SmartinsightsComponent', () => {
  let component: SmartinsightsComponent;
  let fixture: ComponentFixture<SmartinsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartinsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartinsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
