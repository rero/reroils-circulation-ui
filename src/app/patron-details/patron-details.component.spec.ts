import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatronDetailsComponent } from './patron-details.component';

describe('PatronDetailsComponent', () => {
  let component: PatronDetailsComponent;
  let fixture: ComponentFixture<PatronDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatronDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
