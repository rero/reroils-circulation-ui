import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { WebpackTranslateLoader } from '../webpack-translate-loader';
import { DataTablesModule } from 'angular-datatables';

import { RequestedItemsListComponent } from './requested-items-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../app.component';

describe('RequestedItemsListComponent', () => {
  let component: RequestedItemsListComponent;
  let fixture: ComponentFixture<RequestedItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedItemsListComponent ],
      imports: [
        RouterTestingModule,
        DataTablesModule,
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
    fixture = TestBed.createComponent(RequestedItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
