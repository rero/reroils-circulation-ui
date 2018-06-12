import { Component } from '@angular/core';
import { PatronsService } from './patrons.service';
import { Patron } from './patron';

/**
 * Main Component
 */
@Component({
  selector: 'reroils-circulation-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public manager: Patron;

  constructor(private patronsService: PatronsService) {
    this.patronsService.logged_user.subscribe(logged_user => {
      this.manager = logged_user;
    });
  }
}
