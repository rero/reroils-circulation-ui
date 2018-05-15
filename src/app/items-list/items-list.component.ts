import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ItemUI, ItemAction } from '../item';
import { Patron } from '../patron';

/**
 * Items list Component
 */
@Component({
  selector: 'reroils-circulation-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent {
  @Input() items: ItemUI[];
  @Input() patron: Patron;
  @Output() removeItem = new EventEmitter<ItemUI>();
  @Output() applyItems = new EventEmitter<ItemUI[]>();

  constructor() {
    this.items =  new Array<ItemUI>();
  }

  remove(item: ItemUI) {
    if (item) {
      this.removeItem.emit(item);
    }
  }

  apply(items: ItemUI[]) {
     if (items.length) {
      this.applyItems.emit(items);
    }
  }

  warningRequests(item) {
    if (this.patron) {
      return item.hasRequests
          && (item.getAction(this.patron) === ItemAction.return);
    } else {
      return item.hasRequests;
    }
  }

  endDate(item: ItemUI) {
    return item.endDate(this.patron);
  }
  // TODO: move to a ItemsList class
  hasPendingActions() {
    if (this.patron) {
      if (this.items.filter(item => item.getAction(this.patron) !== ItemAction.no).length > 0) {
        return true;
      }
    }
    return false;
  }
}
