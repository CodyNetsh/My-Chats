import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnonymousPage } from './annonymous.page';

describe('AnnonymousPage', () => {
  let component: AnnonymousPage;
  let fixture: ComponentFixture<AnnonymousPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnonymousPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnonymousPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
