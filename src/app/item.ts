import { Moment } from 'moment';
import * as moment from 'moment';
import { Patron } from './patron';
import { DocumentsService } from './documents.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { UUID } from 'angular2-uuid';

export function _(str) {
  return str;
}

export enum ItemStatus {
  on_shelf = _('on_shelf'),
  missing = _('missing'),
  on_loan = _('on_loan')
}

export enum ItemAction {
  loan = _('loan'),
  return = _('return'),
  request = _('request'),
  lose = _('lose'),
  return_missing = _('return_missing'),
  cancel = _('cancel'),
  extend = _('extend'),
  no = _('no')
}

export enum ItemType {
  standard_loan = _('standard_loan'),
  short_loan = _('short_loan'),
  no_loan = _('no_loan')
}

export interface Loan {
  patron_barcode: string;
  end_date: string;
}
export interface Circulation {
    status: ItemStatus;
    holdings: Loan[];
}

export interface Item {
  id: string;
  pid: string;
  title: string;
  authors: string;
  barcode: string;
  location_name: string;
  callNumber: string;
  item_type: ItemType;
  _circulation: Circulation;
}

/**
 * Circulation Item User Interface
 */
export class ItemUI {
  private standardLoanDuration = 30;
  private shortLoanDuration = 15;
  public currentAction: ItemAction;
  public done: ItemAction;
  private _lastDueDate: Moment;
  private response = new Subject();
  constructor (
    public item: Item,
    private documentsService: DocumentsService
  ) {
  }

  get onLoan() {
    return this.item._circulation.status === ItemStatus.on_loan;
  }

  get onShelf() {
    return this.item._circulation.status === ItemStatus.on_shelf;
  }

  get id() {
    if (this.item.id) {
      return this.item.id;
    }
    return this.item.pid;
  }

  get isMissing() {
    return this.item._circulation.status === ItemStatus.missing;
  }

  get loanDuration() {
    if (this.item.item_type === ItemType.standard_loan) {
      return this.standardLoanDuration;
    }
    if (this.item.item_type === ItemType.short_loan) {
      return this.shortLoanDuration;
    }
    return 0;
  }


  expectedDueDate(patron?: Patron) {
    if (patron && this.onShelf) {
      return moment().add(this.loanDuration, 'days');
    }
    return null;
  }

  currentDueDate() {
    const loan = this.loan;
    if (loan) {
      return moment(loan.end_date);
    }
    return null;
  }

  lastDueDate() {
    if (this.onShelf && this.done === ItemAction.return) {
      return this._lastDueDate;
    }
    return null;
  }

  endDate(patron?: Patron) {
    if (this.expectedDueDate(patron)) {
      return this.expectedDueDate(patron);
    }
    if (this.currentDueDate()) {
      return this.currentDueDate();
    }
    if (this.lastDueDate()) {
      return this.lastDueDate();
    }
    return null;
  }

  get loanExpired() {
    let date = this.currentDueDate();
    if (!date) {
      date = this.lastDueDate();
    }
    if (date && date.isBefore()) {
      return true;
    }
    return false;
  }

  canLoan(patron?: Patron) {
    if (!this.onShelf) {
      return false;
    }
    if (this.hasRequests && !this.isFirstInRequests(patron)) {
      return false;
    }
    if (this.item.item_type === ItemType.no_loan) {
      return false;
    }
    return true;
  }

  isFirstInRequests(patron?: Patron) {
    if (patron && this.hasRequests && this.requestedPosition(patron) === 1) {
      return true;
    }
    return false;
  }

  getAction(patron?: Patron) {
    if (this.currentAction) {
      return this.currentAction;
    } else {
      const actions = this.getActions(patron);
      return actions[0];
    }
  }

  setAction(act: ItemAction) {
    this.currentAction = act;
  }

  apply(patron): Observable<object> {
    switch (this.getAction(patron)) {
      case ItemAction.loan: {
        this.doLoan(patron);
        break;
      }
      // case ItemAction.request: {
      //   response = this.doRequest(patron);
      //   break;
      // }
      case ItemAction.return: {
        this.doReturn();
        break;
      }
      case ItemAction.return_missing: {
        this.doReturnMissing();
        break;
      }
      // case ItemAction.lose: {
      //   response = this.doLose();
      //   break;
      // }
      // case ItemAction.cancel: {
      //   response = this.doCancel(patron);
      //   break;
      // }
      default: {
        break;
      }
    }
    this.setAction(this.getAction(patron));
    return this.response;
  }

  public createLoan(patron) {
    return {
      'id': UUID.UUID(),
      'patron_barcode': patron.barcode,
      'start_date': moment().format('YYYY-MM-DD'),
      'end_date': this.expectedDueDate(patron).format('YYYY-MM-DD')
    };
  }

  doLoan(patron) {
    if (!this.requestedBy(patron)) {
      this.item._circulation.holdings.unshift(this.createLoan(patron));
    }
    this.documentsService.loanItem(this, patron).subscribe(item => {
      this.done = ItemAction.loan;
      this.item._circulation.status = ItemStatus.on_loan;
      this.currentAction = ItemAction.no;
      this.response.next({status: 'ok'});
      this.response.complete();
    });
  }

  doReturn() {
    const item = this.item._circulation.holdings.shift();
    const end_date = moment(item.end_date);
    this.item._circulation.status = ItemStatus.on_shelf;
    this.documentsService.returnItem(this)
                          .subscribe(() => {
                             this.done = ItemAction.return;
                             this._lastDueDate = end_date;
                             this.response.next({status: 'ok'});
                             this.response.complete();
                          });
  }

  doReturnMissing() {
    this.item._circulation.status = ItemStatus.on_shelf;
    this.documentsService.returnMissingItem(this).subscribe(item => {
      this.done = ItemAction.return_missing;
      this.response.next({status: 'ok'});
      this.response.complete();
    });
  }

  doRequest(patron) {
    this.holdings.push(this.createLoan(patron));
    this.documentsService.updateItem(this.item).subscribe(item => {
      this.done = ItemAction.request;
      this.response.next({status: 'ok'});
      this.response.complete();
    });
  }

  doLose() {
    if (this.onLoan) {
      this.item._circulation.holdings.shift();
    }
    this.item._circulation.status = ItemStatus.missing;
    this.documentsService.updateItem(this.item).subscribe(item => {
      this.done = ItemAction.lose;
      this.response.next({status: 'ok'});
      this.response.complete();
    });
  }

  doCancel(patron) {
    const pos = this.requestedPosition(patron);
    if (pos > 0) {
      this.item._circulation.holdings.splice(pos - 1, 1);
    }
    this.documentsService.updateItem(this.item).subscribe(item => {
      this.done = ItemAction.cancel;
      this.response.next({status: 'ok'});
      this.response.complete();
    });
  }

  loanedBy(patron) {
    const holding = this.holdings[0];
    if (!this.onLoan) {
      return false;
    }
    if (holding.patron_barcode === patron.barcode) {
      return true;
    }
    return false;
  }

  requestedBy(patron) {
    return this.requestedPosition(patron) > 0;
  }

  get holdings() {
    return this.item._circulation.holdings;
  }

  get loan() {
    if (this.onLoan) {
      return this.holdings[0];
    }
    return null;
  }

  get requests() {
    if (this.onLoan) {
      return this.holdings.slice(1);
    }
    return this.holdings;
  }

  get hasRequests() {
    if (this.onLoan) {
      return (this.holdings.length - 1) > 0;
    }
    return this.holdings.length > 0;
  }

  requestedPosition(patron) {
    if (!patron) {
      return 0;
    }
    return this.requests.findIndex(holding => holding.patron_barcode === patron.barcode) + 1;
  }

  isActionLoan(patron?: Patron): boolean {
    return this.getAction(patron) === ItemAction.loan;
  }

  isActionReturn(patron?: Patron): boolean {
    return this.getAction(patron) === ItemAction.return;
  }

  getActions(patron?: Patron) {
    let actions = [];
    if (patron) {
      if (this.onShelf) {
        actions = [ItemAction.loan, ItemAction.no];
      }
      if (this.onLoan) {
        actions = [ItemAction.no, ItemAction.return];
      }
    }
    return actions;
  }

}
