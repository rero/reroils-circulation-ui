import { Moment } from 'moment';
import * as moment from 'moment';
import { Patron } from './patron';
import { DocumentsService } from './documents.service';

export enum ItemStatus {
  on_shelf = 'on_shelf',
  missing = 'missing',
  on_loan = 'on_loan'
}

export enum ItemAction {
  loan = 'loan',
  return = 'return',
  request = 'request',
  lose = 'lose',
  return_missing = 'return_missing',
  cancel = 'cancel',
  extend = 'extend',
  no = 'no'
}

export enum ItemType {
  standard_loan = 'standard_loan',
  short_loan = 'short_loan',
  no_loan = 'no_loan'
}

export interface Loan {
  patron_barcode: string
}
export interface Circulation {
    status: ItemStatus,
    holdings: Loan[]
}

export interface Item {
  id: string,
  title: string,
  authors: string,
  barcode: string,
  location: string,
  callNumber: string,
  item_type: ItemType,
  _circulation: Circulation
}

export class ItemUI {
  private standardLoanDuration: 30;
  private shortLoanDuration: 15;
  private current_action: ItemAction;

  constructor (
    public item: Item,
    private documentsService: DocumentsService
  ) {}

  get onLoan() {
    return this.item._circulation.status === ItemStatus.on_loan;
  }

  get onShelf() {
    return this.item._circulation.status === ItemStatus.on_shelf;
  }

  get id() {
    return this.item.id;
  }

  get isMissing() {
    return this.item._circulation.status === ItemStatus.missing;
  }

  get loanDuration() {
    if(this.item.item_type === ItemType.standard_loan) {
      return this.standardLoanDuration;
    }
    if(this.item.item_type === ItemType.short_loan) {
      return this.shortLoanDuration;
    }
    return 0;
  }

  get endDate() {
    return moment().add(this.loanDuration, 'days');
  }

  canLoan(patron?: Patron) {
    if (this.item.item_type === ItemType.no_loan || this.isMissing) {
      return false;
    }
    return true;
  }

  getAction(patron?: Patron) {
    if (this.current_action) {
      return this.current_action;
    } else {
      let actions = this.getActions(patron);
      return actions[0];
    }
  }

  setAction(act: ItemAction) {
    this.current_action = act;
  }

  apply(patron) {
    switch (this.getAction(patron)) {
      case ItemAction.loan: {
        this.doLoan(patron);
        break;
      }
      case ItemAction.request: {
        this.doRequest(patron);
        break;
      }
      case ItemAction.return: {
        this.doReturn();
        break;
      }
      case ItemAction.return_missing: {
        this.doReturnMissing();
        break;
      }
      case ItemAction.lose: {
        this.doLose();
        break;
      }
      case ItemAction.cancel: {
        this.doCancel(patron);
        break;
      }
      default: {
        break;
      }
    }
    this.setAction(null);
  }
  private createLoan(patron) {
    return {
      "patron_barcode": patron.barcode,
      "start_date": moment().format('YYYY-MM-DD'),
      "end_date": this.endDate.format('YYYY-MM-DD')
    }
  }

  doLoan(patron) {
    if (!this.requestedBy(patron)){
      this.item._circulation.holdings.unshift(this.createLoan(patron));
    }
    this.item._circulation.status = ItemStatus.on_loan;
    this.documentsService.updateItem(this.item).subscribe(item => {this.item = item;});
  }

  doReturn() {
    this.item._circulation.holdings.shift();
    this.item._circulation.status = ItemStatus.on_shelf;
    this.documentsService.updateItem(this.item).subscribe(item => {this.item = item;});
  }

  doReturnMissing() {
    this.item._circulation.status = ItemStatus.on_shelf;
    this.documentsService.updateItem(this.item).subscribe(item => {this.item = item;});
  }

  doRequest(patron) {
    this.holdings.push(this.createLoan(patron));
    this.documentsService.updateItem(this.item).subscribe(item => {this.item = item;});
  }

  doLose() {
    if (this.onLoan) {
      this.item._circulation.holdings.shift();
    }
    this.item._circulation.status = ItemStatus.missing;
    this.documentsService.updateItem(this.item).subscribe(item => {this.item = item;});
  }

  doCancel(patron) {
    const pos = this.requestedPosition(patron);
    console.log(pos);
    if (pos > 0) {
      this.item._circulation.holdings.splice(pos-1, 1);
    }
    this.documentsService.updateItem(this.item).subscribe(item => {this.item = item;});
  }

  loanedBy(patron) {
    const holding = this.holdings[0];
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
      return this.holdings.slice(2);
    }
    return this.holdings;
  }

  hasRequests() {
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


  getActions(patron?: Patron) {
    let actions = [];

    if (this.onShelf) {
      if (!patron) {
        actions.unshift(ItemAction.lose);
      }
      if (patron && this.canLoan(patron)) {
        if (!this.requestedBy(patron)){
          actions.unshift(ItemAction.request);
        } else {
          actions.unshift(ItemAction.cancel);
        }
        if (!this.hasRequests() || this.requestedPosition(patron) === 1) {
          actions.unshift(ItemAction.loan);
        }
      }
    }

    if (this.onLoan) {
      actions = [];
      if (patron) {
        if (this.requestedBy(patron)) {
          actions.unshift(ItemAction.cancel);
        }
        if (!(this.loanedBy(patron) || this.requestedBy(patron))) {
          actions.unshift(ItemAction.request);
        }
        if (this.loanedBy(patron)) {
          actions.push(ItemAction.lose);
          actions.unshift(ItemAction.return);
          actions.unshift(ItemAction.no);
        }
      } else {
        actions = [ItemAction.return, ItemAction.lose]
      }
    }

    if (this.isMissing) {
      actions = [ItemAction.return_missing];
    }

    if (actions.findIndex(action => action === ItemAction.no) === -1) {
      actions.push(ItemAction.no);
    }
    return actions;
  }

}
