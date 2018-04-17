import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { URLPrefixService } from './urlprefix.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item, Circulation, ItemUI } from './item';
import { Patron } from './patron';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

@Injectable()
export class DocumentsService {
    documentsUrl: string;  // URL to web api
    loanUrl: string;
    patronItemsUrl: string;

    constructor(private http: HttpClient, private urlPrefix: URLPrefixService) {
        this.documentsUrl = urlPrefix.documentsURL;
        this.loanUrl = urlPrefix.loanURL;
        this.patronItemsUrl = urlPrefix.patronItemsURL;
    }

    createItem(data) {
      let item = new ItemUI(data, this)
      return item;
    }

    getPatronItems(patron: Patron) {
      return this.http
          .get<Item[]>(this.patronItemsUrl + patron.barcode)
          .map(res => {
            return res.map(item => {return this.createItem(item)});
          });
    }

    getItem(barcode: string): Observable<ItemUI[]> {
        return this.http
        .get<Item[]>(this.documentsUrl + barcode)
        .map(res => {
            if (res['hits']) {
                let documents = res['hits']['hits'];
                let items = new Array<ItemUI>();
                for (let doc of documents) {
                  let item = doc.metadata.itemslist.filter(obj => String(obj.barcode) === barcode).pop();
                  item.title = doc.metadata.title;
                  let itemObj = this.createItem(item);
                  items.push(itemObj);
                }
                return items;
            } else {
                return res.map(item => {return this.createItem(item)});
            }
        });
    }

    loanItem(item: ItemUI, patron: Patron) {
      const loan = {
        "pid": item.id,
        "patron_barcode": patron.barcode,
        "start_date": moment().format('YYYY-MM-DD'),
        "end_date": item.endDate.format('YYYY-MM-DD')
      }
      return this.http.post(this.loanUrl, loan);
    }

    updateItem(item: Item) : Observable<Item> {
      return this.http.put<Item>(this.loanUrl, item);
    }
}
