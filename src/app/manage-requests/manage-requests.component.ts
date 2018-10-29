import { Component, Input } from '@angular/core';
import { DocumentsService } from '../documents.service';
import { ItemUI, ItemStatus } from '../item';
import { PatronsService } from '../patrons.service';
import { TranslateStringService } from '../translate.service';

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
  private library_pid: string;
  message: string;
  message_params: {};

  constructor (
    private documentsService: DocumentsService,
    private patronsService: PatronsService,
    private translate: TranslateStringService
  ) {
    this.items = new Array<ItemUI>();
    this.searchText = '';
    this.placeholder = _('Please enter an item barcode.');
    patronsService.logged_user.subscribe( user => {
      this.library_pid = user.library_pid;
      this.getRequestedItems();
    });
  }

  getRequestedItems() {
    this.documentsService.getRequestedItems(this.library_pid).subscribe(items => {
      this.items = items;
      this.message = '';
      this.message_params = {};
    });
  }

  searchValueUpdated(search_text: string) {
    this.searchText = search_text;
    const item = this.items.find(iter_item => iter_item.item.barcode === search_text);
    if (item === undefined) {
      this.message = _('item not found');
    } else {
      item.doValidateRequest();
      this.message = _('The item is {{status}}');
      switch (item.status) {
        case ItemStatus.at_desk:
          this.message_params = {'status': this.translate.trans(ItemStatus.at_desk)};
          break;
        case ItemStatus.in_transit:
          this.message_params = {'status': this.translate.trans(ItemStatus.in_transit)};
          break;
        default:
          this.message = '';
          this.message_params = {};
      }
      setTimeout(() => { this.searchText = ''; }, 500);
    }
  }
}
