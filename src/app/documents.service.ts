import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { URLPrefixService } from './urlprefix.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item, Circulation, ItemUI, ItemStatus } from './item';
import { Patron } from './patron';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import { environment } from '../environments/environment';

/**
 * Documents with Items Services
 *
 * to interact with invenio REST API
 */
@Injectable()
export class DocumentsService {

    constructor(private http: HttpClient,
                private urlPrefix: URLPrefixService) {}

    createItem(data) {
      const item = new ItemUI(data, this);
      return item;
    }

    getPatronItems(patron: Patron) {
      return this.http
          .get<Item[]>(this.urlPrefix.patronItemsURL + patron.barcode)
          .map(res => {
            if (res['hits']) {
              const total = res['hits']['total'];
              const documents = res['hits']['hits'];
              if (total) {
                const items = [];
                for (const doc of documents) {
                  for (const item of doc.metadata.itemslist) {
                    items.push(this.createItem(item));
                    item.title = doc.metadata.title;
                  }
                }
                return items;
              } else {
                return [];
              }
            }
            return res.map(item => this.createItem(item));
          });
    }

    getItem(barcode: string): Observable<ItemUI[]> {
        return this.http
        .get<Item[]>(this.urlPrefix.documentsURL + barcode)
        .map(res => {
            if (res['hits']) {
                const documents = res['hits']['hits'];
                const items = new Array<ItemUI>();
                for (const doc of documents) {
                  const item = doc.metadata.itemslist.filter(obj => String(obj.barcode) === barcode).pop();
                  item.title = doc.metadata.title;
                  const itemObj = this.createItem(item);
                  items.push(itemObj);
                }
                return items;
            } else {
                return res.map(item => this.createItem(item));
            }
        });
    }

    loanItem(item: ItemUI, patron: Patron) {
      if (!environment.production) {
        item.item._circulation.status = ItemStatus.on_loan;
        return this.updateItem(item.item);
      }
      const loan = {
        'pid': item.id,
        'patron_barcode': patron.barcode,
        'start_date': moment().format('YYYY-MM-DD'),
        'end_date': item.expectedDueDate(patron).format('YYYY-MM-DD')
      };
      return this.http.post(this.urlPrefix.loanItemURL, loan);
    }

    returnItem(item: ItemUI) {
      if (!environment.production) {
        return this.updateItem(item.item);
      }
      const body = {
        pid: item.id
      };
      return this.http.post(this.urlPrefix.returnItemURL, body);
    }

    returnMissingItem(item: ItemUI) {
      if (!environment.production) {
        return this.updateItem(item.item);
      }
      const body = {
        pid: item.id
      };
      return this.http.post(this.urlPrefix.returnMissingItemURL, body);
    }

    updateItem(item: Item): Observable<Item> {
      return this.http.put<Item>(this.urlPrefix.loanItemURL, item);
    }
}
