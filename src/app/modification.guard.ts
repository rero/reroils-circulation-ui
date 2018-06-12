import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ManageCheckinCheckoutComponent } from './manage-checkin-checkout/manage-checkin-checkout.component';

@Injectable()
export class ModificationGuard implements CanDeactivate<ManageCheckinCheckoutComponent> {
  canDeactivate(
    component: ManageCheckinCheckoutComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate();
  }
}
