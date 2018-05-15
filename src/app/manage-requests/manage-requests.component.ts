import { Component, Input } from '@angular/core';
import { DocumentsService } from '../documents.service';
import { ItemUI, ItemStatus } from '../item';

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
  @Input()
  private member_pid: string;
  message: string;

  constructor (private documentsService: DocumentsService) {
    this.items = new Array<ItemUI>();
    this.searchText = '';
    this.placeholder = _('Please enter an item barcode.');
  }

  @Input() set visible(value: boolean) {
    if (value) {
      this.searchText = '';
      this.message = '';
      this.getRequestedItems();
    } else {
      this.searchText = undefined;
      this.items = new Array<ItemUI>();
    }
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
