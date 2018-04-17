import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

/**
 * Set of URLs to interact with invenio REST API
 */
@Injectable()
export class URLPrefixService {

  public patronsURL: string;
  public documentsURL: string;
  public loanItemURL: string;
  public patronItemsURL: string;
  public returnItemURL: string;
  public returnMissingItemURL: string;

  constructor() {
    if (environment.production) {
      this.patronsURL = '/api/patrons/?q=barcode:';
      this.documentsURL = '/api/documents/?q=itemslist.barcode:';
      this.patronItemsURL = '/api/documents/?&size=100&q=itemslist._circulation.holdings.patron_barcode:';
      this.loanItemURL = '/items/loan';
      this.returnItemURL = '/items/return';
      this.returnMissingItemURL = '/items/return_missing';
    } else {
      this.patronsURL = '/api/patrons?barcode=';
      this.documentsURL = '/api/items?barcode=';
      this.patronItemsURL = '/api/items?patron_barcode=';
      this.loanItemURL = '/api/items';
      this.returnItemURL = '/api/items';
      this.returnMissingItemURL = '/api/items';
    }
  }
}
