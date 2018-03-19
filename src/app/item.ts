import { Moment } from 'moment';

export enum ItemStatus {
  on_shelf = 'on_shelf',
  missing = 'missing',
  on_loan = 'on_loan'
}

export enum ItemType {
  standard_loan = 'standard_loan',
  short_loan = 'short_loan',
  no_loan = 'no_loan'
}

export class Circulation {
  constructor (
    public status?: ItemStatus,
    public holdings?: object[]
    ) {}
}

export class Item {
  constructor (
    public pid?: string,
    public title?: string,
    public authors?: string,
    public barcode?: number,
    public location?: string,
    public callNumber?: string,
    public endDate?: Moment,
    public startDate?: Moment,
    public itemType?: ItemType,
    public _circulation?: Circulation
  ) {}
}
