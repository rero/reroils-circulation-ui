import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { URLPrefixService } from './urlprefix.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Patron } from './patron';
import 'rxjs/add/operator/map';


@Injectable()
export class PatronsService {

  patronsUrl: string;  // URL to web api

  constructor(private http: HttpClient, private urlPrefix: URLPrefixService) {
    this.patronsUrl = urlPrefix.patronsURL;
  }

  getPatron (card_number: string): Observable<Patron[]> {
    return this.http
               .get(this.patronsUrl + card_number)
               .map(res => {
                 // invenio format
                 if (res['hits']) {
                   const patrons = Array();
                   const metadata = res['hits']['hits'];
                   metadata.forEach(function (value) {
                     patrons.push(value.metadata);
                   });
                   return <Patron[]> patrons;
                 } else {
                   return <Patron[]>res;
                 }
               });
  }
}
