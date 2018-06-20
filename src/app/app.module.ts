import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemCirculationService } from './in-memory-circulation.service';
import { Routes, RouterModule, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

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

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { WebpackTranslateLoader } from './webpack-translate-loader';
import { ItemUI } from './item';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from './confirm/confirm.component';

import { RequestedItemsListComponent } from './requested-items-list/requested-items-list.component';
import { ManageRequestsComponent } from './manage-requests/manage-requests.component';
import { ManageCheckinCheckoutComponent } from './manage-checkin-checkout/manage-checkin-checkout.component';
import { DataTablesModule } from 'angular-datatables';
import { ModificationGuard } from './modification.guard';

import { TranslateStringService } from './translate.service';

const routes: Routes = [
  {path: '', redirectTo: 'checkinout', pathMatch: 'full'},
  {path: 'checkinout', component: ManageCheckinCheckoutComponent, canDeactivate: [ModificationGuard] },
  {path: 'checkinout/patron/:patron', component: ManageCheckinCheckoutComponent },
  {path: 'requests', component: ManageRequestsComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    PatronDetailsComponent,
    ItemsListComponent,
    UserMessageComponent,
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
                                                                         { delay: 1000, dataEncapsulation: false,
                                                                           put204: false }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    }),
    ModalModule.forRoot(),
    RouterModule.forRoot(routes),
    DataTablesModule
  ],
  providers: [
    URLPrefixService,
    PatronsService,
    DocumentsService,
    ModificationGuard,
    TranslateStringService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
