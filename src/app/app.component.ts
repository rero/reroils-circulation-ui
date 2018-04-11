import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Patron } from './patron';
import { PatronsService } from './patrons.service';
import { DocumentsService } from './documents.service';
import { Item, ItemStatus, ItemType } from './item';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {TranslateService} from '@ngx-translate/core';

export function _(str: string) {
  return str;
}

@Component({
  selector: 'reroils-circulation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  patron: Patron;
  public placeholder: string;
  public searchText: string;
  public message: string;
  public items: Item[];

  constructor(private patronsService: PatronsService,
              private documentsService: DocumentsService,
              @Inject(LOCALE_ID) locale,
              translate: TranslateService) {
    this.placeholder = _('Please enter a patron card number.');
    this.searchText = '';
    this.patronsService = patronsService;
    this.documentsService = documentsService;
    this.message = '';
    this.items = new Array<Item>();
    moment.locale(locale);
    translate.setDefaultLang('en');
    translate.use(locale);
  }

  searchValueUpdated(search_text: string) {
    this.searchText = search_text;
    if (!this.patron) {
      this.getPatron(search_text);
    } else {
      this.getItem(search_text);
    }
  }

  getItem(search_text) {
    if (search_text) {
      this.documentsService.getItem(search_text).subscribe(items => {
        switch (items.length) {
          case 1: {
            const item = items[0];
            const status = item['_circulation'].status;
            const itemType = item.itemType;
            if (status === ItemStatus.missing) {
              this.message = _('item cannot be loaned: the status is missing');
              break;
            }
            if (status === ItemStatus.on_loan) {
              this.message = _('item cannot be loaned: it is alreay loaned');
              break;
            }
            if (itemType === ItemType.no_loan) {
              this.message = _('item cannot be loaned: due to the item type');
              break;
            }
            if (this.items.find(x => x.barcode === item.barcode)) {
              this.message = _('item is alreay on the list');
              break;
            }
            if (item['_circulation'].status === ItemStatus.on_shelf) {
              item.startDate = moment();
              let duration_in_days = 30;
              if (itemType === ItemType.short_loan) {
                duration_in_days = 15;
              }
              item.endDate = moment().add(duration_in_days, 'days');
              this.items.push(item);
              this.searchText = '';
              this.message = '';
            } else {
              this.message = _(`bad item status ${ item['_circulation'].status }!`);
            }
            break;
          }
          case 0: {
            this.message = _('item not found');
            break;
          }
          default: {
            this.message = _('more than one item found');
            break;
          }
        }
      });
    }
  }

  getPatron(search_text) {
    if (search_text) {
      this.patronsService.getPatron(search_text).subscribe(patrons => {
        switch (patrons.length) {
          case 1: {
            this.patron = patrons[0];
            this.placeholder = _('Please enter an item barcode.');
            this.searchText = '';
            this.message = '';
            break;
          }
          case 0: {
            this.message = _('patron not found');
            break;
          }
          default: {
            this.message = _('more than one patron found');
            break;
          }
        }
      });
    }
  }

  clearPatron(patron: Patron) {
    this.patron = null;
    this.placeholder = _('Please enter a patron card number.');
    this.searchText = '';
    this.items = new Array<Item>();
  }

  removeItem(item: Item) {
    this.items = this.items.filter(obj => obj !== item);
  }

  validateItems(items: Item[]) {
    let observables = [];
    for (let item of items) {
      observables.push(
        this.documentsService
        .loanItem(item, this.patron)
        )
    }
    Observable.forkJoin(observables).subscribe(responses => {
      let all_done = true;
      for (let response of responses) {
        if (response['status'] !== 'ok' ) {
          all_done = false;
        }
      }
      if (all_done) {
        this.message = `${items.length} items sucesfully loaned`;
        this.clearPatron(this.patron)
      } else {
        this.message = _('an error occurs on the server');
      }
    });
  }
}
