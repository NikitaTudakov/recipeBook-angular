import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import * as authActions from './auth.actions';
import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: string, email: string, id: string, token: string,) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, id, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
    return new authActions.AuthenticateSuccess({
      email: email,
      id: id,
      token: token,
      tokenExpirationDate: expirationDate
    });
}

const handleError = (errorRes) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of( new authActions.AuthenticateFail(errorMessage));
  };
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.';
      break;
  }
  return of( new authActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  authSignUp = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.SIGNUP_START),
      switchMap((signUpData: authActions.SignupStart) => {
        return this.http
        .post<AuthResponseData>(
          'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + environment.fireBaseKey,
          {
            email: signUpData.payload.email,
            password: signUpData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(respData => {
            this.authService.setLogoutTimer(+respData.expiresIn * 1000)
          }),
          map(respData => {
            return handleAuthentication(respData.expiresIn,respData.email,respData.localId,respData.idToken)
          }),
          catchError(errorResponce => {
            return handleError(errorResponce)
          })
        )
      })
    )
  })

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return { type: 'DUMMY'};
        }
    
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
    
        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration)
          return new authActions.AuthenticateSuccess({
            email:loadedUser.email,
            id:loadedUser.id,
            token:loadedUser.token,
            tokenExpirationDate:new Date(userData._tokenExpirationDate)
          });
        }

        return { type: 'DUMMY'}
      })
    )
  })

  authLogin = createEffect((): Observable<authActions.AuthActions> => {
    return this.actions$.pipe(
      ofType(authActions.LOGIN_START),
      switchMap((authData: authActions.LoginStart) => {
        return this.http
        .post<AuthResponseData>(
          'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + environment.fireBaseKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(respData => {
            this.authService.setLogoutTimer(+respData.expiresIn * 1000)
          }),
          map(respData => {
            return handleAuthentication(respData.expiresIn,respData.email,respData.localId,respData.idToken)
          }),
          catchError(errorResponce => {
            return handleError(errorResponce)
          })
        )
      })
    )
  });

  authRedirect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.AUTHENTICATE_SUCCESS),
        tap(() => this.router.navigate(['/']))
      )
    },
    {dispatch: false}
  )

  authLogout = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth'])
        })
      )
    },
    {dispatch: false}
  )
}