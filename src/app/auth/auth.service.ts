import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromApp from './store/auth.reducer';
import * as authActions from './store/auth.actions';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.authState>) {}



  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new authActions.AuthLogout())
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer)
    }
  }
}
