import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ParsedRequestUrl, RequestInfo, RequestInfoUtilities, ResponseOptions } from 'angular-in-memory-web-api/interfaces';
import { getStatusText, STATUS } from 'angular-in-memory-web-api/http-status-codes';

export class InMemCirculationService implements InMemoryDbService {
  get(reqInfo: RequestInfo) {
    const patron_barcodes = reqInfo.query.get('patron_barcode');
    if (patron_barcodes) {
      return reqInfo.utils.createResponse$(() => {
        const collection = reqInfo.collection;
        const dataEncapsulation = reqInfo.utils.getConfig().dataEncapsulation;
        const id = reqInfo.id;
        const data = collection.filter(
          item => {
            return item._circulation.holdings.findIndex(
              holding => {
                return holding.patron_barcode === patron_barcodes[0];
              }) > -1;
          }
        );
        const options: ResponseOptions = data ?
        {
          body: dataEncapsulation ? { data } : data,
          status: STATUS.OK
        } :
        {
          body: { error: `'Items' with id='${id}' not found` },
          status: STATUS.NOT_FOUND
        };
        return this.finishOptions(options, reqInfo);
      });
    }
    return undefined; // let the default GET handle all others
  }

  private finishOptions(options: ResponseOptions, {headers, url}: RequestInfo) {
    options.statusText = getStatusText(options.status);
    options.headers = headers;
    options.url = url;
    return options;
  }

  createDb() {
    const patrons = [{
      'barcode': '2030155308',
      'birth_date': '1969-02-01',
      'city': 'Vérossaz',
      'email': 'virgile.charbonnet@vionnaz.ch',
      'first_name': 'Virgile',
      'last_name': 'Charbonnet',
      'name': 'Charbonnet, Virgile',
      'patron_type': 'standard_user',
      'phone': '+41244857275',
      'id': '3',
      'postal_code': '1891',
      'street': 'Chemin Vers-Chez-Borrée, 172'
    }, {
      'barcode': '2030124287',
      'birth_date': '2004-10-11',
      'city': 'Sion',
      'email': 'helder.figueiredo@hotmail.com',
      'first_name': 'Helder',
      'last_name': 'de Figueiredo Santos',
      'name': 'de Figueiredo Santos, Helder',
      'patron_type': 'standard_user',
      'id': '2',
      'postal_code': '1950',
      'street': 'Rue des Aubépines, 15'
    }, {
      'barcode': '2050124311',
      'birth_date': '1969-06-07',
      'city': 'La Chaux-de-Fonds',
      'email': 'simolibri07@gmail.com',
      'first_name': 'Simonetta',
      'last_name': 'Casalini',
      'name': 'Casalini, Simonetta',
      'patron_type': 'standard_user',
      'phone': '+41324993585',
      'id': '1',
      'postal_code': '2300',
      'street': 'Avenue Leopold-Robert, 132'
    }];
    const items = [{
      'id': '1',
      'title': 'Le tour du monde en vingt-six lettres',
      'authors': 'Le Quellec, Maryvonne ; Lanot, Frank',
      'barcode': '10000001887',
      'callNumber': 'SR-01887',
      'location_name': 'Main Base 2',
      'item_type': 'standard_loan',
      '_circulation': {
        'holdings': [],
        'status': 'on_shelf'
      }
    }, {
      'id': '2',
      'title': 'Le tour du monde en vingt-six lettres',
      'authors': 'Le Quellec, Maryvonne ; Lanot, Frank',
      'barcode': '10000001888',
      'callNumber': 'SR-01888',
      'location_name': 'Store Base 2',
      'item_type': 'standard_loan',
      '_circulation': {
        'holdings': [{
          'id': '9aa5693b-3e00-439d-a60a-cf083fc248bb',
          'patron_barcode': '2030155308',
          'start_date': '2018-01-01',
          'end_date': '2018-05-01'
        }],
        'status': 'on_loan'
      }
    }, {
      'id': '3',
      'title': 'Les retrouvailles : pièce en trois actes et 7 tableaux',
      'authors': 'Lao, She , 1899-1966 ; Reclus-Houang, Chou-yi ; Université de Paris 7',
      'barcode': '10000001703',
      'callNumber': 'SR-01703',
      'location_name': 'Store Base 1',
      'item_type': 'no_loan',
      '_circulation': {
        'holdings': [],
        'status': 'on_shelf'
      }
    }, {
      'id': '4',
      'title': 'Les retrouvailles : pièce en trois actes et 7 tableaux',
      'authors': 'Lao, She , 1899-1966 ; Reclus-Houang, Chou-yi ; Université de Paris 7',
      'barcode': '10000001704',
      'callNumber': 'SR-01704',
      'location_name': 'Store Base 1',
      'item_type': 'short_loan',
      '_circulation': {
        'holdings': [],
        'status': 'on_shelf'
      }
    }, {
      'id': '5',
      'title': 'Les retrouvailles : pièce en trois actes et 7 tableaux',
      'authors': 'Lao, She , 1899-1966 ; Reclus-Houang, Chou-yi ; Université de Paris 7',
      'barcode': '10000001705',
      'callNumber': 'RR-01705',
      'location_name': 'Main Base 1',
      'item_type': 'standard_loan',
      '_circulation': {
        'holdings': [],
        'status': 'missing'
      }
    }, {
      'id': '6',
      'title': 'Les retrouvailles : pièce en trois actes et 7 tableaux',
      'authors': 'Lao, She , 1899-1966 ; Reclus-Houang, Chou-yi ; Université de Paris 7',
      'barcode': '10000001706',
      'callNumber': 'PA-01706',
      'location_name': 'Main Base 1',
      'item_type': 'standard_loan',
      '_circulation': {
        'holdings': [{
          'id': '9aa5693c-3e00-439d-a60a-cf083fc248bb',
          'patron_barcode': '2030155308'
        }],
        'status': 'on_shelf'
        }
      }, {
      'id': '7',
      'title': 'Les retrouvailles : pièce en trois actes et 7 tableaux',
      'authors': 'Lao, She , 1899-1966 ; Reclus-Houang, Chou-yi ; Université de Paris 7',
      'barcode': '10000001707',
      'callNumber': 'PA-01706',
      'location_name': 'Main Base 1',
      'item_type': 'standard_loan',
      '_circulation': {
        'holdings': [{
          'id': '9aa5693c-3e00-439d-a60a-cf083fc248bb',
          'patron_barcode': '2030124287'
        }, {
          'id': '1aa5693c-3e00-439d-a60a-cf083fc248bb',
          'patron_barcode': '2030155308'
        }, {
          'id': '2aa5693c-3e00-439d-a60a-cf083fc248bb',
          'patron_barcode': '2050124311'
        }],
        'status': 'on_shelf'
      }
    }, {
      'id': '8',
      'title': 'Le tour du monde en vingt-six lettres',
      'authors': 'Le Quellec, Maryvonne ; Lanot, Frank',
      'barcode': '10000001708',
      'callNumber': 'SR-01888',
      'location_name': 'Store Base 2',
      'item_type': 'standard_loan',
      '_circulation': {
        'holdings': [{
          'id': '8aa5693b-3e00-439d-a60a-cf083fc248bb',
          'patron_barcode': '2030155308',
          'start_date': '2018-01-01',
          'end_date': '2018-02-01'
        }],
        'status': 'on_loan'
      }
    }];
    return {patrons, items};
  }
}
