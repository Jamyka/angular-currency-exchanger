/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EurGbpComponent } from './eur-gbp.component';

describe('EurGbpComponent', () => {
  let component: EurGbpComponent;
  let fixture: ComponentFixture<EurGbpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EurGbpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EurGbpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
