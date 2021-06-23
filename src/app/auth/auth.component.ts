import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {Subscription } from 'rxjs';

import { AuthService} from './auth.service';
import { AlertComponent } from '../shared/alert/alert.components';
import { Placeholder } from '../shared/placeholder/placeholder.directive';
import * as authActions from './store/auth.actions';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(Placeholder, {static:false}) alertPlace: Placeholder;
  subsciption: Subscription;
  storeSub: Subscription;

  constructor(
    private componentFctoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
   this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.errorMessage;
      if(this.error) {
        this.showErrorMess(this.error)
      }
    })
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(new authActions.LoginStart({email,password}))
    } else {
      this.store.dispatch(new authActions.SignupStart({email,password}))
    }

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new authActions.CloseError())
  }

  ngOnDestroy() {
    if(this.subsciption) {
      this.subsciption.unsubscribe();
    }

    this.storeSub.unsubscribe()
  }

  showErrorMess(message) {
    const alertCmpFactory =  this.componentFctoryResolver.resolveComponentFactory(AlertComponent);

    const placeContanerViewRef = this.alertPlace.viewContainerRef;
    
    placeContanerViewRef.clear();
    const containerRef = placeContanerViewRef.createComponent(alertCmpFactory);

    containerRef.instance.message = message;
    this.subsciption =  containerRef.instance.close.subscribe(() => {
    this.subsciption.unsubscribe()
    placeContanerViewRef.clear()
    })
  }
}
