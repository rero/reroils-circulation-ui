import { Moment } from 'moment';

export interface Patron {
  id: number;
  barcode: string;
  firstname: string;
  lastname: string;
  type: string;
  birthdate: Moment;
  email: string;
  street: string;
  npa: string;
  city: string;
  phone_number: string;
  affiliated_library: string;
}
