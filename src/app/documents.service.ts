import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { URLPrefixService } from './urlprefix.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item, Circulation, ItemUI, ItemStatus } from './item';
import { Patron } from './patron';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import { environment } from '../environments/environment';
import { PatronsService } from './patrons.service';

/**
 * Documents with Items Services
 *
 * to interact with invenio REST API
 */
@Injectable()
export class DocumentsService {

  private _logged_user: Patron;

  constructor(private http: HttpClient,
    private urlPrefix: URLPrefixService,
    private patronsService: PatronsService) {
    this.patronsService.logged_user.subscribe(logged_user => {
      this._logged_user = logged_user;
    });
  }

  createItem(data) {
    const item = new ItemUI(data, this, this.patronsService, this._logged_user);
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

  getRequestedItems(memberPid) {
    return this.http
      .get<Item[]>(this.urlPrefix.requestedItemsURL + memberPid)
      .map(res => {
        if (res['hits']) {
          const total = res['hits']['total'];
          const documents = res['hits']['hits'];
          if (total) {
            const items = [];
            for (const doc of documents) {
              for (const item of doc.metadata.itemslist) {
                if (item.member_pid === memberPid && item.requests_count > 0 && item._circulation.status === 'on_shelf') {
                  items.push(this.createItem(item));
                  item.title = doc.metadata.title;
                }
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

  receiveItem(item: ItemUI) {
    if (!environment.production) {
      return this.updateItem(item.item);
    }
    const body = {
      pid: item.id
    };
    return this.http.post(this.urlPrefix.receiveItemURL, body);
  }

  validateRequestedItem(item: ItemUI) {
    if (!environment.production) {
      return this.updateItem(item.item);
    }
    const body = {
      pid: item.id
    };
    return this.http.post(this.urlPrefix.validateRequestedItemURL, body);
  }

  renewalItem(item: ItemUI) {
    if (!environment.production) {
      return this.updateItem(item.item);
    }

    const body = {
      pid: item.id,
      end_date: item.holdings[0].end_date,
      renewal_count: item.holdings[0].renewal_count
    };
    return this.http.put(this.urlPrefix.renewalItemURL, body);
  }

  updateItem(item: Item): Observable<Item> {
    return this.http.put<Item>(this.urlPrefix.loanItemURL, item);
  }

  // requestItem(item: ItemUI) {
  //   if (!environment.production) {
  //     return this.updateItem(item.item);
  //   }

  //   // const body = {
  //   //   pid: item.id
  //   // };
  //   // return this.http.post(this.urlPrefix.requestItemURL, body);
  // }

  // loseItem(item: ItemUI) {
  //   if (!environment.production) {
  //     return this.updateItem(item.item);
  //   }

  //   // const body = {
  //   //   pid: item.id
  //   // };
  //   // return this.http.post(this.urlPrefix.loseItemURL, body);
  // }

  // cancelItem(item: ItemUI) {
  //   if (!environment.production) {
  //     return this.updateItem(item.item);
  //   }

  //   // const body = {
  //   //   pid: item.id
  //   // };
  //   // return this.http.post(this.urlPrefix.cancelItemURL, body);
  // }

}
