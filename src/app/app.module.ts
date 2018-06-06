import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemCirculationService } from './in-memory-circulation.service';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PatronDetailsComponent } from './patron-details/patron-details.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { URLPrefixService } from './urlprefix.service';
import { UserMessageComponent } from './user-message/user-message.component';
import { PatronsService } from './patrons.service';
import { DocumentsService } from './documents.service';
import { NicedatePipe } from './nicedate.pipe';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { WebpackTranslateLoader } from './webpack-translate-loader';
import { ItemUI } from './item';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from './confirm/confirm.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { RequestedItemsListComponent } from './requested-items-list/requested-items-list.component';
import { ManageRequestsComponent } from './manage-requests/manage-requests.component';
import { ManageCheckinCheckoutComponent } from './manage-checkin-checkout/manage-checkin-checkout.component';


const routes: Routes = [
  {path: '', redirectTo: 'checkinout', pathMatch: 'full'},
  {path: 'checkinout', component: ManageCheckinCheckoutComponent },
  {path: 'checkinout/patron/:patron', component: ManageCheckinCheckoutComponent },
  {path: 'requests', component: ManageRequestsComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    PatronDetailsComponent,
    ItemsListComponent,
    UserMessageComponent,
    NicedatePipe,
    ConfirmComponent,
    RequestedItemsListComponent,
    ManageRequestsComponent,
    ManageCheckinCheckoutComponent,
    // ItemUI
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    environment.production ? [] : HttpClientInMemoryWebApiModule.forRoot(InMemCirculationService,
                                                                         { delay: 500, dataEncapsulation: false,
                                                                           put204: false }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    }),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [
    URLPrefixService,
    PatronsService,
    DocumentsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
