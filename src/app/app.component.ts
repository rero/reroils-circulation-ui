import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Patron } from './patron';
import { PatronsService } from './patrons.service';
import { DocumentsService } from './documents.service';
import { ItemUI, ItemStatus, ItemType } from './item';
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
  public items: ItemUI[];

  constructor(private patronsService: PatronsService,
              private documentsService: DocumentsService,
              @Inject(LOCALE_ID) locale,
              translate: TranslateService) {
    this.placeholder = _('Please enter a patron card number or an item barcode.');
    this.searchText = '';
    this.patronsService = patronsService;
    this.documentsService = documentsService;
    this.message = '';
    this.items = new Array<ItemUI>();
    moment.locale(locale);
    translate.setDefaultLang('en');
    translate.use(locale);
  }

  searchValueUpdated(search_text: string) {
    this.searchText = search_text;
    if (!this.patron) {
      this.getPatronOrItem(search_text);
    } else {
      this.getItem(search_text);
    }
  }

  private getItem(search_text) {
    if (search_text) {
      this.documentsService.getItem(search_text).subscribe(items => {
        switch (items.length) {
          case 1: {
            let item:ItemUI;
            item = <ItemUI>(items[0]);
            if (this.patron){
              if (!item.canLoan(this.patron)) {
                this.message = _('item cannot be loaned: due to the item type');
                break;
              }
              if (item.isMissing) {
                this.message = _('item cannot be loaned: the status is missing');
                break;
              }
            }
            if (this.items.find(x => x.id === item.id)) {
              this.message = _('item is alreay on the list');
            } else {
              this.items.unshift(item);
              this.searchText = '';
              this.message = '';
              this.placeholder = _('Please enter a patron card number or an item barcode.')
              if (item.onLoan && !this.checkoutMode) {
                this.message = 'the item has been returned';
                item.doReturn();
              }
            }
            break;
          }
          case 0: {
            if (this.checkoutMode || this.items.length) {
              this.message = _('item not found');
            } else {
              this.message = _('item or patron not found');
            }
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

  get checkoutMode () {
    if (this.patron) {
      return true;
    }
    return false;
  }

  private getPatronOrItem(search_text) {
    // if (this.checkoutMode || this.items.length) {
    //   this.getItem(search_text);
    // } else {
      this.getPatron(search_text);
    // }
  }

  private getPatronItems() {
    this.documentsService.getPatronItems(this.patron).subscribe(items => {
      for (let patron_item of items) {
        if (this.items.findIndex(item => item.id === patron_item.id ) < 0) {
          this.items.push(patron_item);
        }
      }
    });
  }

  private getPatron(search_text) {
    if (search_text) {
      this.patronsService.getPatron(search_text).subscribe(patrons => {
        switch (patrons.length) {
          case 1: {
            this.patron = patrons[0];
            this.items = this.items.filter(item => item.canLoan(this.patron));
            this.placeholder = _('Please enter an item barcode.');
            this.searchText = '';
            this.message = '';
            this.getPatronItems();
            break;
          }
          case 0: {
            // this.message = _('patron not found');
            this.getItem(search_text)
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
    this.placeholder = _('Please enter a patron card number or an item barcode.');
    this.searchText = '';
    this.message = '';
    this.items = new Array<ItemUI>();
  }

  removeItem(item: ItemUI) {
    this.items = this.items.filter(obj => obj !== item);
  }

  applyItems(items: ItemUI[]) {
    for (let item of items) {
      item.apply(this.patron);
    }
    // let observables = [];
    // for (let item of items) {
    //   observables.push(
    //     this.documentsService
    //     .loanItem(item, this.patron)
    //     )
    // }
    // Observable.forkJoin(observables).subscribe(responses => {
    //   let all_done = true;
    //   for (let response of responses) {
    //     if (response['status'] !== 'ok' ) {
    //       all_done = false;
    //     }
    //   }
    //   if (all_done) {
    //     this.message = `${items.length} items sucesfully loaned`;
    //     this.clearPatron(this.patron)
    //   } else {
    //     this.message = _('an error occurs on the server');
    //   }
    // });
  }
}
