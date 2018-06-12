import { Component, Input } from '@angular/core';
import { DocumentsService } from '../documents.service';
import { ItemUI, ItemStatus } from '../item';
  import { PatronsService } from '../patrons.service';

export function _(str: string) {
  return str;
}

@Component({
  selector: 'reroils-circulation-manage-requests',
  templateUrl: './manage-requests.component.html',
  styleUrls: ['./manage-requests.component.css']
})
export class ManageRequestsComponent {
  public placeholder: string;
  public searchText: string;
  public items: ItemUI[];
  private member_pid: string;
  message: string;

  constructor (private documentsService: DocumentsService, private patronsService: PatronsService) {
    this.items = new Array<ItemUI>();
    this.searchText = '';
    this.placeholder = _('Please enter an item barcode.');
    patronsService.logged_user.subscribe( user => {
      this.member_pid = user.member_pid;
      this.getRequestedItems();
    });
  }

  getRequestedItems() {
    this.documentsService.getRequestedItems(this.member_pid).subscribe(items => {
      this.items = items;
      this.message = '';
    });
  }

  searchValueUpdated(search_text: string) {
    this.searchText = search_text;
    const item = this.items.find(iter_item => iter_item.item.barcode === search_text);
    if (item === undefined) {
      this.message = _('item not found');
    } else {
      this.message = '';
      item.doValidateRequest();
      setTimeout(() => { this.searchText = ''; }, 500);
    }
  }
}
