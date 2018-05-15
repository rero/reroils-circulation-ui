import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { URLPrefixService } from './urlprefix.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Patron } from './patron';
import 'rxjs/add/operator/map';

/**
 * Patron Services
 *
 * to interact with invenio REST API
 */
@Injectable()
export class PatronsService {

  constructor(private http: HttpClient,
              private urlPrefix: URLPrefixService) {
              this.logged_user = this.getLoggedUser();
  }

  public logged_user: Observable<Patron>;

  getPatron(card_number: string): Observable<Patron[]> {
    return this.http
               .get(this.urlPrefix.patronsURL + card_number)
               .map(response => {
                 // invenio format
                 if (response['hits']) {
                   const patrons = Array();
                   const metadata = response['hits']['hits'];
                   metadata.forEach(function (value) {
                     patrons.push(value.metadata);
                   });
                   return <Patron[]> patrons;
                 } else {
                   return <Patron[]>response;
                 }
               });
  }

  getLoggedUser(): Observable<Patron> {
        return this.http
               .get(this.urlPrefix.loggedUserURL)
               .map(response => {
                 // invenio format
                 if (response['hits']) {
                   const user = response['hits']['hits'][0];
                   return <Patron> user;
                 } else {
                   return <Patron>response;
                 }
               });
  }
}
