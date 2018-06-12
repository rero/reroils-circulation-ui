import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Patron } from '../patron';
import { PatronsService } from '../patrons.service';
import { DocumentsService } from '../documents.service';
import { ItemUI, ItemStatus, ItemType, ItemAction } from '../item';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {TranslateService} from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/of';
export function _(str: string) {
  return str;
}

@Component({
  selector: 'reroils-circulation-manage-checkin-checkout',
  templateUrl: './manage-checkin-checkout.component.html',
  styleUrls: ['./manage-checkin-checkout.component.css']
})
export class ManageCheckinCheckoutComponent {

  patron: Patron;
  patron_info: Patron;
  public placeholder: string;
  public searchText: string;
  public message: string;
  public items: ItemUI[];
  public requestedItems: ItemUI[];
  confirm_message: string;

  private confirmed: Observable<boolean>;
  constructor(private patronsService: PatronsService,
              private documentsService: DocumentsService,
              @Inject(LOCALE_ID) locale,
              translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router) {
    // console.log(route.queryParams);
    route.queryParamMap.subscribe(params => this.getPatron(params.get('patron')));
    this.placeholder = _('Please enter a patron card number or an item barcode.');
    this.searchText = '';
    this.patronsService = patronsService;
    this.documentsService = documentsService;
    this.message = '';
    this.items = new Array<ItemUI>();
    this.requestedItems = new Array<ItemUI>();
    moment.locale(locale);
    translate.setDefaultLang('en');
    translate.use(locale);
    this.confirm_message = undefined;
    this.confirmed = Observable.of(false);
    // this.confirmed.complete();
  }

  canDeactivate(): Observable<boolean> {
    if (!this.hasPendingActions()) {
      return Observable.of(true);
    }
    this.confirm_message = _('sure to abort pending changes?');
    return this.confirmed;
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
            this.patron_info = null;
            let item: ItemUI;
            item = <ItemUI>(items[0]);
            const alredy_existing_item = this.items.find(x => x.id === item.id);
            if (alredy_existing_item) {
              if (alredy_existing_item.loanedBy(this.patron)) {
                alredy_existing_item.setAction(ItemAction.return);
                // this.message = _('item action has changed');
              } else {
                this.message = _('item is already on the list');
              }
              break;
            }
            if (this.patron) {
              if (!item.canLoan(this.patron)) {
                if (item.isMissing) {
                  this.message = _('item cannot be loaned: the status is missing');
                  break;
                }
                if (item.onLoan) {
                  this.message = _('item cannot be loaned: it is already loaned');
                  break;
                }
                if (item.item.item_type === ItemType.no_loan) {
                  this.message = _('item cannot be loaned: due to the item type');
                  break;
                }
                if (item.hasRequests && !item.isFirstInRequests(this.patron)) {
                  this.message = _('item cannot be loaned: it is already requested by another patron');
                  break;
                }
                this.message = _('item cannot be loaned');
                break;
              }
            } else {
              const loan = item.loan;
              if (loan) {
                this.getPatronInfo(loan.patron_barcode);
              }
            }
            this.items.unshift(item);
            this.searchText = '';
            this.message = '';
            this.placeholder = _('Please enter a patron card number or an item barcode.');
            if (!this.checkoutMode) {
              switch (item.status) {
                case ItemStatus.on_loan: {
                  item.doReturn();
                  break;
                }
                case ItemStatus.missing: {
                  this.message = _('the item has been returned from missing');
                  item.doReturnMissing();
                  break;
                }
                case ItemStatus.in_transit: {
                  item.doReceive();
                  break;
                }
                default: {
                  break;
                }
              }
            }
            if (item.hasRequests) {
              this.message = _('The item has requests!');
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
      this.getPatron(search_text);
  }

  private getPatronItems() {
    this.documentsService.getPatronItems(this.patron).subscribe(items => {
      for (const patron_item of items) {
        if (this.items.findIndex(item => item.id === patron_item.id ) < 0) {
          if (patron_item.loanedBy(this.patron)) {
            this.items.push(patron_item);
          }
        }
      }
    });
  }

  clearItems() {
    if (this.patron) {
      if (this.items.length && this.items[0].canLoan(this.patron)) {
        this.items.splice(1);
        this.items[0].done = null;
      } else {
        this.items = new Array<ItemUI> ();
      }
    }
  }

  private getPatronInfo(search_text) {
    if (search_text) {
      this.patronsService.getPatron(search_text).subscribe(patrons => {
        switch (patrons.length) {
          case 1: {
            this.patron_info = patrons[0];
            break;
          }
        }
      });
    }
  }

  private getPatron(search_text) {
    if (search_text) {
      this.patronsService.getPatron(search_text).subscribe(patrons => {
        switch (patrons.length) {
          case 1: {
            this.patron_info = null;
            this.patron = patrons[0];
            this.items = this.items.filter(item => item.canLoan(this.patron));
            this.placeholder = _('Please enter an item barcode.');
            this.searchText = '';
            this.message = '';
            this.clearItems();
            this.getPatronItems();
            this.router.navigate([], { queryParams: {
              patron: this.patron.barcode
            }});
            break;
          }
          case 0: {
            // this.message = _('patron not found');
            this.getItem(search_text);
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
    if (this.hasPendingActions()) {
      this.confirm_message = _('sure to abort pending changes?');
    } else {
      this.doClearPatron();
    }
  }

  doClearPatron() {
    this.patron = null;
    this.placeholder = _('Please enter a patron card number or an item barcode.');
    this.searchText = '';
    this.message = '';
    this.items = new Array<ItemUI>();
    this.requestedItems = new Array<ItemUI>();
    this.router.navigate([], { queryParams: {}});
  }

  removeItem(item: ItemUI) {
    this.items = this.items.filter(obj => obj !== item);
  }

  confirmRemovePatron(ok: boolean) {
    if (ok === true) {
      this.doClearPatron();
      this.confirmed = Observable.of(true);
    } else {
      this.confirmed = Observable.of(false);
    }
    this.confirm_message = undefined;
  }

  hasPendingActions() {
    if (this.patron) {
      if (this.items.filter(item => item.getAction(this.patron) !== ItemAction.no).length > 0) {
        return true;
      }
    }
    return false;
  }

  onLoanItemsOnly() {
    this.items = this.items.filter(item => item.loanedBy(this.patron));
  }

  getRequestedItems() {
    return this.items.filter(item => item.onDesk);
  }

  applyItems(items: ItemUI[]) {
    const observables = [];
    for (const item of items) {
      if (item.getAction(this.patron) !== ItemAction.no) {
        observables.push(
          item.apply(this.patron)
        );
      }
    }
    Observable.forkJoin(observables).subscribe(responses => {
      let all_done = true;
      for (const response of responses) {
        if (response['status'] !== 'ok' ) {
          all_done = false;
        }
      }
      if (!all_done) {
        this.message = _('an error occurs on the server');
      } else {
        this.requestedItems = this.getRequestedItems();
        this.onLoanItemsOnly();
      }
    });
  }

}
