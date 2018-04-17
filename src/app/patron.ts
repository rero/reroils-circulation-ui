import { Moment } from 'moment';

// for translations
export function _(str) {
  return str;
}

/**
 * Patron Type
 */
export enum PatronType {
  standard_user = _('standard_user')
}

/**
 * Patron Library
 */
export interface Patron {
  id: number;
  barcode: string;
  firstname: string;
  lastname: string;
  type: PatronType;
  birthdate: Moment;
  email: string;
  street: string;
  npa: string;
  city: string;
  phone_number: string;
  affiliated_library: string;
}
