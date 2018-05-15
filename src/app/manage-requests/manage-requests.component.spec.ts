// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { WebpackTranslateLoader } from '../webpack-translate-loader';
// import { SearchBarComponent } from '../search-bar/search-bar.component';
// import { RequestedItemsListComponent } from '../requested-items-list/requested-items-list.component';
// import { NicedatePipe } from '../nicedate.pipe';
// import { DocumentsService } from '../documents.service';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { URLPrefixService } from '../urlprefix.service';
// import { PatronsService } from '../patrons.service';

// import { ManageRequestsComponent } from './manage-requests.component';

// describe('ManageRequestsComponent', () => {
//   let component: ManageRequestsComponent;
//   let fixture: ComponentFixture<ManageRequestsComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ManageRequestsComponent, SearchBarComponent, RequestedItemsListComponent, NicedatePipe ],
//       imports: [
//         HttpClientModule,
//         TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useClass: WebpackTranslateLoader
//           }
//         })
//       ],
//       providers: [
//         URLPrefixService,
//         PatronsService,
//         DocumentsService
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ManageRequestsComponent);
//     component = fixture.componentInstance;
//     // fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
