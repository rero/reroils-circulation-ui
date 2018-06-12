import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ItemUI, ItemAction } from '../item';
import { Patron } from '../patron';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'reroils-circulation-requested-items-list',
  templateUrl: './requested-items-list.component.html',
  styleUrls: ['./requested-items-list.component.css']
})
export class RequestedItemsListComponent implements OnDestroy, OnInit {
  _items: ItemUI[];

  @Input() set items(items: ItemUI[]) {
    this._items = items;

    const observables = [];
    for (const item of items) {
        observables.push(
          item.patron
        );
    }
    // update the table at the end of patron requests
    Observable.forkJoin(observables).subscribe(responses => {
      this.dtTrigger.next();
    });
  }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor() {
    this._items = new Array<ItemUI>();

  }
  ngOnInit(): void {
    this.dtOptions = {
      searching: false,
      info: false,
      paging: false
    };
  }

  ngOnDestroy(): void {
    // unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
