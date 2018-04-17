import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../item';
import { Patron } from '../patron';

@Component({
  selector: 'reroils-circulation-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent {
  @Input() items: Item[];
  @Input() patron: Patron;
  @Output() onRemoveItem = new EventEmitter<Item>();
  @Output() onApplyItems = new EventEmitter<Item[]>();

  constructor() { }

  remove(item: Item) {
    if (item) {
      this.onRemoveItem.emit(item);
    }
  }

  apply(items: Item[]) {
     if (items.length) {
      this.onApplyItems.emit(items);
    }
  }
}
