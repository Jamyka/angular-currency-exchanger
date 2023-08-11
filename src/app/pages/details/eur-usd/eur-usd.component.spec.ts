/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EurUsdComponent } from './eur-usd.component';

describe('EurUsdComponent', () => {
  let component: EurUsdComponent;
  let fixture: ComponentFixture<EurUsdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EurUsdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EurUsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
