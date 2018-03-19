import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../item';


@Component({
  selector: 'reroils-circulation-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent {
  @Input() items: Item[];
  @Output() onRemoveItem = new EventEmitter<Item>();
  @Output() onValidateItems = new EventEmitter<Item[]>();

  constructor() { }

  removeItem(item: Item) {
    if (item) {
      this.onRemoveItem.emit(item);
    }
  }

  validateItems(items: Item[]) {
     if (items.length) {
      this.onValidateItems.emit(items);
    }
  }
}
