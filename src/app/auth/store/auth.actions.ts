import { Action } from "@ngrx/store";

export const LOGIN_START = 'LOGIN_START';
export const AUTHENTICATE_SUCCESS = 'LOGIN';
export const AUTHENTICATE_FAIL = 'LOGIN_FAIL';
export const SIGNUP_START = 'SIGNUP_START';
export const CLOSE_ERROR = 'CLOSE_ERROR'
export const LOGOUT = 'LOGOUT';
export const AUTO_LOGIN = 'AUTO_LOGIN'

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor(
    public payload: {
      email: string,
      id: string,
      token: string,
      tokenExpirationDate: Date
    }
  ) {}
};

export class AuthLogout implements Action {
  readonly type = LOGOUT;
};

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: {
    email: string,
    password: string
  }) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload:string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload:{
    email: string,
    password: string
  }){}
}

export class CloseError implements Action {
  readonly type = CLOSE_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN
}

export type AuthActions =
| AuthenticateSuccess
| AuthLogout
| LoginStart
| AuthenticateFail
| CloseError
| SignupStart
| AutoLogin;