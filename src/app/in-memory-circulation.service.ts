import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemCirculationService implements InMemoryDbService {
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
      'pid': '3',
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
      'pid': '2',
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
      'pid': '1',
      'postal_code': '2300',
      'street': 'Avenue Leopold-Robert, 132'
    }];
    const items = [{
      'pid': '1',
      'title': 'Le tour du monde en vingt-six lettres',
      'authors': 'Le Quellec, Maryvonne ; Lanot, Frank',
      'barcode': 10000001887,
      'callNumber': 'SR-01887',
      'location': 'Main Base 2',
      'itemType': 'standard_loan',
      '_circulation': {
        'holdings': [],
        'status': 'on_shelf'
      }
    }, {
      'pid': '2',
      'title': 'Le tour du monde en vingt-six lettres',
      'authors': 'Le Quellec, Maryvonne ; Lanot, Frank',
      'barcode': 10000001888,
      'callNumber': 'SR-01888',
      'location': 'Store Base 2',
      'itemType': 'standard_loan',
      '_circulation': {
        'holdings': [],
        'status': 'on_loan'
      }
    }, {
      'pid': '3',
      'title': 'Les retrouvailles : pièce en trois actes et 7 tableaux',
      'authors': 'Lao, She , 1899-1966 ; Reclus-Houang, Chou-yi ; Université de Paris 7',
      'barcode': 10000001703,
      'callNumber': 'SR-01703',
      'location': 'Store Base 1',
      'itemType': 'no_loan',
      '_circulation': {
        'holdings': [],
        'status': 'on_shelf'
      }
    }, {
      'pid': '4',
      'title': 'Les retrouvailles : pièce en trois actes et 7 tableaux',
      'authors': 'Lao, She , 1899-1966 ; Reclus-Houang, Chou-yi ; Université de Paris 7',
      'barcode': 10000001704,
      'callNumber': 'SR-01704',
      'location': 'Store Base 1',
      'itemType': 'short_loan',
      '_circulation': {
        'holdings': [],
        'status': 'on_shelf'
      }
    }, {
      'pid': '5',
      'title': 'Les retrouvailles : pièce en trois actes et 7 tableaux',
      'authors': 'Lao, She , 1899-1966 ; Reclus-Houang, Chou-yi ; Université de Paris 7',
      'barcode': 10000001705,
      'callNumber': 'RR-01705',
      'location': 'Main Base 1',
      'itemType': 'standard_loan',
      '_circulation': {
        'holdings': [],
        'status': 'missing'
      }
    }, {
      'pid': '6',
      'title': 'Les retrouvailles : pièce en trois actes et 7 tableaux',
      'authors': 'Lao, She , 1899-1966 ; Reclus-Houang, Chou-yi ; Université de Paris 7',
      'barcode': 10000001706,
      'callNumber': 'PA-01706',
      'location': 'Main Base 1',
      'itemType': 'standard_loan',
      '_circulation': {
        'holdings': [],
        'status': 'on_shelf'
      }
    }];
    return {patrons, items};
  }
}
