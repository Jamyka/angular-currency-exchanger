import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionFormComponent } from './conversion-form.component';

describe('ConversionFormComponent', () => {
  let component: ConversionFormComponent;
  let fixture: ComponentFixture<ConversionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConversionFormComponent]
    });
    fixture = TestBed.createComponent(ConversionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
