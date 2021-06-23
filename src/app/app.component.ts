import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth/auth.service';
import * as fromApp from './store/app.reducer';
import * as authActions from './auth/store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'recipes-book';
  page = 'recipes';

  constructor(
    private authServise: AuthService,
    @Inject(PLATFORM_ID) private platformId,
    private store: Store<fromApp.AppState>
  ){}

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      // this.authServise.autoLogin()
      this.store.dispatch(new authActions.AutoLogin())
    }
  }
}
