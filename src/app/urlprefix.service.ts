import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

/**
 * Set of URLs to interact with invenio REST API
 */
@Injectable()
export class URLPrefixService {

  public patronsURL: string;
  public documentsURL: string;
  public requestedItemsURL: string;
  public loanItemURL: string;
  public patronItemsURL: string;
  public returnItemURL: string;
  public returnMissingItemURL: string;
  public loggedUserURL: string;
  public renewalItemURL: string;
  public validateRequestedItemURL: string;
  public receiveItemURL: string;


  constructor() {
    if (environment.production) {
      this.patronsURL = '/api/patrons/?q=barcode:';
      this.documentsURL = '/api/documents/?q=itemslist.barcode:';
      this.requestedItemsURL = '/api/documents/?size=100&q=itemslist.requests_count:%5B1%20TO%20*%20%5D%20AND%20item_status:on_shelf%20AND%20itemslist.member_pid:';
      this.patronItemsURL = '/api/documents/?&size=100&q=itemslist._circulation.holdings.patron_barcode:';
      this.loggedUserURL = '/patrons/logged_user';
      this.loanItemURL = '/items/loan';
      this.returnItemURL = '/items/return';
      this.returnMissingItemURL = '/items/return_missing';
      this.renewalItemURL = '/items/extend';
      this.validateRequestedItemURL = '/items/validate';
      this.receiveItemURL = '/items/receive';

    } else {
      this.patronsURL = '/api/patrons?barcode=';
      this.documentsURL = '/api/items?barcode=';
      this.requestedItemsURL = '/api/items/requested/?member_pid=';
      this.patronItemsURL = '/api/items?patron_barcode=';
      this.loanItemURL = '/api/items';
      this.returnItemURL = '/api/items';
      this.returnMissingItemURL = '/api/items';
      this.loggedUserURL = '/api/logged_user/1';
      this.renewalItemURL = '/api/items';
      this.validateRequestedItemURL = '/api/items';
      this.receiveItemURL = '/api/items';
    }
  }
}
