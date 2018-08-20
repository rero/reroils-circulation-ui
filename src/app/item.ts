import { Moment } from 'moment';
import * as moment from 'moment';
import { Patron } from './patron';
import { DocumentsService } from './documents.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { UUID } from 'angular2-uuid';
import { PatronsService } from './patrons.service';
import 'rxjs/add/observable/of';

export function _(str) {
  return str;
}

export enum ItemStatus {
  on_shelf = _('on_shelf'),
  // TODO: remove
  missing = _('missing'),
  on_loan = _('on_loan'),
  in_transit = _('in_transit'),
  at_desk = _('at_desk'),
  out_of_circulation = _('out_of_circulation')
}

export enum ItemAction {
  loan = _('loan'),
  return = _('return'),
  request = _('request'),
  lose = _('lose'),
  receive = _('receive'),
  renewal = _('renewal'),
  return_missing = _('return_missing'),
  cancel = _('cancel'),
  extend = _('extend'),
  validate_request = _('validate_request'),
  no = _('no')
}

export enum ItemType {
  standard_loan = _('standard_loan'),
  short_loan = _('short_loan'),
  on_site_consultation = _('on_site_consultation')
}

export interface Loan {
  patron_barcode: string;
  end_date: string;
  start_date?: string;
  id: string;
  pickup_member_name?: string;
  pickup_member_pid?: string;
  renewal_count?: number;
}

export interface Circulation {
  status: ItemStatus;
  holdings: Loan[];
}

export interface Item {
  id: string;
  $schema?: string;
  pid: string;
  title: string;
  document_pid: string;
  authors?: string;
  barcode: string;
  location_pid: string;
  location_name: string;
  call_number: string;
  member_pid: string;
  member_name: string;
  item_type: ItemType;
  requests_count: number;
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
  private _current_patron: Patron;
  private _current_patron_loading: boolean;
  public _logged_user: Patron;
  public patronLoading: Observable<boolean>;
  constructor (
    public item: Item,
    private documentsService: DocumentsService,
    private patronsService: PatronsService,
    logged_user: Patron
  ) {
    // TODO: logged user
    this._current_patron = undefined;
    this._logged_user = logged_user;
    this.patronLoading = Observable.of(false);
  }

  get onLoan() {
    return this.item._circulation.status === ItemStatus.on_loan;
  }

  get onShelf() {
    return this.item._circulation.status === ItemStatus.on_shelf;
  }

  get onDesk() {
    return this.item._circulation.status === ItemStatus.at_desk;
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
    if (patron && (this.onShelf || this.onDesk)) {
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
    if (this.item.item_type === ItemType.on_site_consultation) {
      return false;
    }
    if (this.onShelf && !this.hasRequests) {
      return true;
    }
    if (this.onDesk && this.isFirstInRequests(patron)) {
      return true;
    }
    return false;
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

      case ItemAction.renewal: {
          this.doRenewal();
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
    this._current_patron = undefined;
    this.setAction(this.getAction(patron));
    return this.response;
  }

  get status() {
    return this.item._circulation.status;
  }

  public createLoan(patron) {
    return {
      'id': UUID.UUID(),
      'patron_barcode': patron.barcode,
      'start_date': moment().format('YYYY-MM-DD'),
      'end_date': this.expectedDueDate(patron).format('YYYY-MM-DD')
    };
  }

  /*-------------------------------------------------------------
  --------------------- Actions ---------------------------------
  --------------------------------------------------------------- */
  doLoan(patron) {
    if (this.requestedBy(patron)) {
      this.holdings.shift();
    }
    this.holdings.unshift(this.createLoan(patron));
    this.documentsService.loanItem(this, patron).subscribe(item => {
      this.done = ItemAction.loan;
      this.item._circulation.status = ItemStatus.on_loan;
      this.currentAction = ItemAction.no;
      this.response.next({status: 'ok'});
      this.response.complete();
    });
  }

  doReturn() {
    // return the item on his own member
    const request = this.requests[0];

    if (!this.hasRequests) {
      if (this.item.member_pid === this._logged_user.member_pid) {
        this.item._circulation.status = ItemStatus.on_shelf;
      } else {
        this.item._circulation.status = ItemStatus.in_transit;
      }
    } else {
      if (request.pickup_member_pid === this._logged_user.member_pid) {
        this.item._circulation.status = ItemStatus.at_desk;
      } else {
        this.item._circulation.status = ItemStatus.in_transit;
      }
    }
    const item = this.holdings.shift();
    const end_date = moment(item.end_date);
    this.documentsService.returnItem(this)
                          .subscribe(() => {
                             this.done = ItemAction.return;
                             this._lastDueDate = end_date;
                             this.response.next({status: 'ok'});
                             this.response.complete();
                          });
  }

  doValidateRequest() {
    if (this.hasRequests) {
      const request = this.requests[0];
      if (request.pickup_member_pid !== this.item.member_pid) {
        this.item._circulation.status = ItemStatus.in_transit;
      } else {
        this.item._circulation.status = ItemStatus.at_desk;
      }
      this.documentsService.validateRequestedItem(this).subscribe(item => {
        this.done = ItemAction.validate_request;
        this.response.next({status: 'ok'});
        this.response.complete();
      });
    }
  }

  doReceive() {
    const request = this.requests[0];
    if (this.hasRequests && (request.pickup_member_pid === this._logged_user.member_pid)) {
        this.item._circulation.status = ItemStatus.at_desk;
    } else {
      if (!this.hasRequests && (this.item.member_pid === this._logged_user.member_pid)) {
        this.item._circulation.status = ItemStatus.on_shelf;
      }
    }

    this.documentsService.receiveItem(this).subscribe(item => {
      this.done = ItemAction.receive;
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

  doRenewal() {
    const holding = this.holdings[0];
    holding.start_date = moment().format('YYYY-MM-DD');
    holding.end_date = moment()
                          .add(this.renewalDurationDays(), 'days')
                          .format('YYYY-MM-DD');
    if (holding.renewal_count === undefined) {
      holding.renewal_count = 1;
    } else {
      holding.renewal_count++;
    }
    this.documentsService.renewalItem(this).subscribe(item => {
      this.done = ItemAction.renewal;
      this.response.next({status: 'ok'});
      this.response.complete();
      this.currentAction = ItemAction.no;
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

  get patron(): Observable<Patron> {
    if (this._current_patron === undefined) {
      if (this.holdings.length && this.holdings[0].patron_barcode && !this._current_patron_loading) {
        const barcode = this.holdings[0].patron_barcode;
        this._current_patron_loading = true;
        this.patronLoading = Observable.of(true);
        const obs = this.patronsService.getPatron(barcode);
        obs.subscribe(patrons => {
          switch (patrons.length) {
            case 1: {
              this._current_patron = patrons[0];
              this._current_patron_loading = false;
              this.patronLoading = Observable.of(false);
              break;
            }
          }
        });
        return obs.map(patrons => <Patron>patrons[0]);
      }
    }
    return Observable.of(this._current_patron);
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
      if (this.onDesk) {
        actions = [ItemAction.loan, ItemAction.no];
      }
      if (this.onLoan) {
        actions = [ItemAction.no, ItemAction.return, ItemAction.renewal];
      }
    }
    return actions;
  }

  renewalDurationDays() {
    return (this.item.item_type === ItemType.standard_loan) ?
                      this.standardLoanDuration :
                      this.shortLoanDuration;
  }
}
