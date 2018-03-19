import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';


@Injectable()
export class URLPrefixService {

  public patronsURL: string;
  public documentsURL: string;
  public loanURL: string;
  constructor() {
    this.patronsURL = '/api/patrons?barcode=';
    if (environment.production) {
      this.patronsURL = '/api/patrons/?q=barcode:';
    }
    this.documentsURL = '/api/items?barcode=';
    if (environment.production) {
      this.documentsURL = '/api/documents/?q=itemslist.barcode:';
    }
    this.loanURL = '';
     if (environment.production) {
      this.loanURL = '/items/loan';
    }
  }
}
