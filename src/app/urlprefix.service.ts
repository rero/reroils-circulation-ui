import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';


@Injectable()
export class URLPrefixService {

  public patronsURL: string;
  public documentsURL: string;
  public loanURL: string;
  public patronItemsURL: string;
  constructor() {
    this.patronsURL = '/api/patrons?barcode=';
    if (environment.production) {
      this.patronsURL = '/api/patrons/?q=barcode:';
    }
    this.documentsURL = '/api/items?barcode=';
    if (environment.production) {
      this.documentsURL = '/api/documents/?q=itemslist.barcode:';
    }
    this.patronItemsURL = '/api/items?patron_barcode=';
    if (environment.production) {
      this.patronItemsURL = '/api/documents/?q=itemslist._circulation.holdings.patron_barcode:';
    }
    this.loanURL = '';
     if (environment.production) {
      this.loanURL = '/items/loan';
    } else {
      this.loanURL = '/api/items';
    }
  }
}
