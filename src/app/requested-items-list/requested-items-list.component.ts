import { Component, Input } from '@angular/core';
import { ItemUI, ItemAction } from '../item';
import { Patron } from '../patron';

@Component({
  selector: 'reroils-circulation-requested-items-list',
  templateUrl: './requested-items-list.component.html',
  styleUrls: ['./requested-items-list.component.css']
})
export class RequestedItemsListComponent {

  @Input() items: ItemUI[];

  constructor() {
    this.items = new Array<ItemUI>();
  }

}
