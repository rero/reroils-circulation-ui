import { Component } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
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
  public manageRequestsVisible: boolean;
  public manager: Patron;

  constructor(private patronsService: PatronsService) {
    this.manageRequestsVisible = false;
    this.patronsService.logged_user.subscribe(logged_user => {
      this.manager = logged_user;
    });
  }

  onTabSelect(data: TabDirective): void {
    if (data instanceof TabDirective) {
      if (data.id === 'manage-requests') {
        this.manageRequestsVisible = true;
      } else {
        this.manageRequestsVisible = false;
      }
    }
  }
}
