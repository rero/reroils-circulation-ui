import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Patron } from '../patron';

/**
 * Patron Informations Component
 */
@Component({
  selector: 'reroils-circulation-patron-details',
  templateUrl: './patron-details.component.html',
  styleUrls: ['./patron-details.component.css']
})
export class PatronDetailsComponent {
  @Input() patron: Patron;
  @Output() clearPatron = new EventEmitter<Patron>();
  @Input() info: boolean;

  clear() {
    if (this.patron) {
      this.clearPatron.emit(this.patron);
    }
  }
}
