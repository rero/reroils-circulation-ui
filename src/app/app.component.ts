import { Component, Inject, LOCALE_ID } from '@angular/core';
import { PatronsService } from './patrons.service';
import { Patron } from './patron';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

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

  constructor(private patronsService: PatronsService,
              @Inject(LOCALE_ID) locale,
              translate: TranslateService) {
    this.patronsService.logged_user.subscribe(logged_user => {
      this.manager = logged_user;
      moment.locale(locale);
      translate.setDefaultLang('en');
      translate.use(locale);
    });
  }
}
