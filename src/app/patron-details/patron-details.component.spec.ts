import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatronDetailsComponent } from './patron-details.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { WebpackTranslateLoader } from '../webpack-translate-loader';
import { RouterTestingModule } from '@angular/router/testing';

describe('PatronDetailsComponent', () => {
  let component: PatronDetailsComponent;
  let fixture: ComponentFixture<PatronDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronDetailsComponent
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: WebpackTranslateLoader
          }
        })
      ]
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
