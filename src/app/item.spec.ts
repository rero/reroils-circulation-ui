import { ItemUI, Item, ItemType, Circulation, ItemStatus, Loan } from './item';
import { Patron, PatronType } from './patron';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

class DocumentsService {

  private _logged_user: Patron;

  constructor () {}
  loanItem(item, patron) { return Observable.of(true); }
  returnItem(item) { return Observable.of(true); }
  validateRequestedItem(item) { return Observable.of(true); }
  receiveItem(item) { return Observable.of(true); }
  renewalItem(item) { return Observable.of(true); }
}

class PatronsService {

  constructor () {}

}

describe('Item', () => {
  let documentsService;
  let patronsService;
  let item: Item;
  let patron: Patron;
  let loggedUser: Patron;

  beforeEach(() => {
    documentsService = new DocumentsService();
    patronsService = new PatronsService;
    item = {
      id: '165',
      $schema: 'https://ils.test.rero.ch/schema/items/item-v0.0.1.json',
      callNumber: '00165',
      title: 'Carte friulane del Quattrocento dall\'archivio di San Cristoforo di Udine',
      barcode: '10000000165',
      _circulation: {
        holdings: [
          {
            start_date: '2018-05-19',
            patron_barcode: '2050124311',
            id: '9b378dc3-fb34-4fc3-b8d8-cc0ec8093cb0',
            pickup_member_pid: '1',
            pickup_member_name: 'National Documentation Centre',
            end_date: '2018-07-03'
          }
        ],
        status: ItemStatus.on_shelf
      },
      member_name: 'National Documentation Centre 3',
      pid: '165',
      item_type: ItemType.standard_loan,
      location_pid: '1',
      location_name: 'Main Base',
      requests_count: 1,
      member_pid: '1'
    };
    patron = {
      name: 'Casalini, Simonetta',
      first_name: 'Simonetta',
      last_name: 'Casalini',
      $schema: 'https://ils.test.rero.ch/schema/patrons/patron-v0.0.1.json',
      barcode: '2050124311',
      postal_code: '2300',
      street: 'Avenue Leopold-Robert, 132',
      pid: '2',
      birth_date: moment('1969-06-07'),
      roles: [
        'patrons'
      ],
      email: 'simolibri07@gmail.com',
      id: '2',
      phone: '+41324993585',
      is_staff: false,
      is_patron: true,
      city: 'La Chaux-de-Fonds',
      patron_type: PatronType.standard_user
    };
    loggedUser = {
      name: 'M\u00fcller, Astrid',
      first_name: 'Astrid',
      last_name: 'M\u00fcller',
      $schema: 'https://ils.test.rero.ch/schema/patrons/patron-v0.0.1.json',
      birth_date: moment('1989-05-14'),
      postal_code: '8200',
      street: 'Spitalstrasse, 112',
      pid: '1',
      phone: '+41324993597',
      roles: [
        'cataloguer',
        'staff'
      ],
      email: 'librarian@rero.ch',
      id: '1',
      member_pid: '1',
      is_staff: true,
      is_patron: false,
      city: 'Schaffhausen'
    };
  });

  it('should create an instance', () => {
    const itemUI = new ItemUI(item, documentsService, patronsService, loggedUser);
    expect(itemUI).toBeTruthy();
  });

  it('should on_shelf status', () => {
    const itemUI = new ItemUI(item, documentsService, patronsService, loggedUser);
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
  });

  it('loan and return', () => {
    const itemUI = new ItemUI(item, documentsService, patronsService, loggedUser);
    itemUI.holdings.shift();
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
    expect(itemUI.hasRequests).toBe(false);
    itemUI.doLoan(patron);
    expect(itemUI.status).toBe(ItemStatus.on_loan);
    itemUI.doReturn();
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
  });

  it('loan, renew and return', () => {
    const itemUI = new ItemUI(item, documentsService, patronsService, loggedUser);
    itemUI.holdings.shift();
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
    expect(itemUI.hasRequests).toBe(false);
    itemUI.doLoan(patron);
    expect(itemUI.status).toBe(ItemStatus.on_loan);
    itemUI.holdings[0].start_date = '2018-05-01';
    itemUI.holdings[0].end_date = '2018-05-31';
    itemUI.doRenewal();
    const today = moment();
    expect(itemUI.holdings[0].start_date).toBe(today.format('YYYY-MM-DD'));
    expect(itemUI.holdings[0].end_date).toBe(today.add(30, 'days').format('YYYY-MM-DD'));
    expect(itemUI.holdings[0].renewal_count).toBe(1);
    itemUI.doReturn();
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
  });

  it('loan requested and return', () => {
    const itemUI = new ItemUI(item, documentsService, patronsService, loggedUser);
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
    expect(itemUI.hasRequests).toBe(true);
    itemUI.doLoan(patron);
    expect(itemUI.status).toBe(ItemStatus.on_loan);
    itemUI.doReturn();
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
  });

  it('request validate loan and return', () => {
    const itemUI = new ItemUI(item, documentsService, patronsService, loggedUser);
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
    expect(itemUI.hasRequests).toBe(true);
    itemUI.doValidateRequest();
    expect(itemUI.status).toBe(ItemStatus.at_desk);
    itemUI.doLoan(patron);
    expect(itemUI.status).toBe(ItemStatus.on_loan);
    itemUI.doReturn();
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
  });

  it('request external pickup validate loan and return', () => {
    const itemUI = new ItemUI(item, documentsService, patronsService, loggedUser);
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
    itemUI.holdings[0].pickup_member_pid = '2';
    expect(itemUI.hasRequests).toBe(true);
    itemUI.doValidateRequest();
    expect(itemUI.status).toBe(ItemStatus.in_transit);
    loggedUser.member_pid = '2';
    itemUI.doReceive();
    expect(itemUI.status).toBe(ItemStatus.at_desk);
    itemUI.doLoan(patron);
    expect(itemUI.status).toBe(ItemStatus.on_loan);
    loggedUser.member_pid = '1';
    itemUI.doReturn();
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
  });

  it('request external pickup validate loan and return external', () => {
    const itemUI = new ItemUI(item, documentsService, patronsService, loggedUser);
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
    itemUI.holdings[0].pickup_member_pid = '2';
    expect(itemUI.hasRequests).toBe(true);
    itemUI.doValidateRequest();
    expect(itemUI.status).toBe(ItemStatus.in_transit);
    loggedUser.member_pid = '2';
    itemUI.doReceive();
    expect(itemUI.status).toBe(ItemStatus.at_desk);
    itemUI.doLoan(patron);
    expect(itemUI.status).toBe(ItemStatus.on_loan);
    itemUI.doReturn();
    expect(itemUI.status).toBe(ItemStatus.in_transit);
    loggedUser.member_pid = '1';
    itemUI.doReceive();
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
  });

  it('request external pickup validate cancel request', () => {
    const itemUI = new ItemUI(item, documentsService, patronsService, loggedUser);
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
    itemUI.holdings[0].pickup_member_pid = '2';
    expect(itemUI.hasRequests).toBe(true);
    itemUI.doValidateRequest();
    expect(itemUI.status).toBe(ItemStatus.in_transit);
    itemUI.holdings.shift();
    loggedUser.member_pid = '2';
    itemUI.doReceive();
    expect(itemUI.status).toBe(ItemStatus.in_transit);
    loggedUser.member_pid = '1';
    itemUI.doReceive();
    expect(itemUI.status).toBe(ItemStatus.on_shelf);
  });

});
