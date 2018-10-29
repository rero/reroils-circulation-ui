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
  id: string;
  pid: string;
  $schema?: string;
  barcode?: string;
  name: string;
  first_name: string;
  last_name: string;
  patron_type?: PatronType;
  birth_date: Moment;
  email: string;
  street: string;
  postal_code: string;
  city: string;
  phone: string;
  library_pid?: string;
  is_staff?: boolean;
  is_patron?: boolean;
  roles: Array<string>;
}
