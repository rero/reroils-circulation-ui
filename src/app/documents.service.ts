import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { URLPrefixService } from './urlprefix.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item, Circulation } from './item';
import { Patron } from './patron';
import 'rxjs/add/operator/map';


@Injectable()
export class DocumentsService {
    documentsUrl: string;  // URL to web api
    loanUrl: string;
    constructor(private http: HttpClient, private urlPrefix: URLPrefixService) {
        this.documentsUrl = urlPrefix.documentsURL;
        this.loanUrl = urlPrefix.loanURL;
    }

    getItem(barcode: string): Observable<Item[]> {
        return this.http
        .get(this.documentsUrl + barcode)
        .map(res => {
            if (res['hits']) {
                let documents = res['hits']['hits'];
                let items = new Array<Item>();
                for (let doc of documents) {
                  let title = doc.metadata.title;
                  let item = doc.metadata.itemslist.filter(obj => String(obj.barcode) === barcode).pop();
                  let circulation = <Circulation>item['_circulation'];
                  let itemObj = new Item();
                  itemObj.pid = item.pid;
                  itemObj.title = title;
                  itemObj.barcode = item.barcode;
                  itemObj.callNumber = item.callNumber;
                  itemObj.location = item.location;
                  itemObj.itemType = item.item_type;
                  itemObj['_circulation'] = circulation;
                  items.push(itemObj);
                }
                return items;
            } else {
                return <Item[]>res;
            }
        });
    }

    loanItem(item: Item, patron: Patron) {
      const loan = {
        "pid": item.pid,
        "patron_barcode": patron.barcode,
        "start_date": item.startDate.format('YYYY-MM-DD'),
        "end_date": item.endDate.format('YYYY-MM-DD')
      }
      return this.http.post(this.loanUrl, loan);
    }
}
