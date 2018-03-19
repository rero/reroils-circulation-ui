import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Patron } from '../patron';


@Component({
  selector: 'reroils-circulation-patron-details',
  templateUrl: './patron-details.component.html',
  styleUrls: ['./patron-details.component.css']
})
export class PatronDetailsComponent {
  @Input() patron: Patron;
  @Output() onClearPatron = new EventEmitter<Patron>();

  clearPatron() {
    if (this.patron) {
      this.onClearPatron.emit(this.patron);
    }
  }
}
