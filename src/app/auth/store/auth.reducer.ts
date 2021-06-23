import { User } from "../user.model";
import * as authActions from './auth.actions';

export interface authState {
  user: User,
  errorMessage: string,
  loading: boolean
};

const initialState: authState = {
  user : null,
  errorMessage: null,
  loading: false
};

export function authReducer(
  state = initialState,
  action: authActions.AuthActions
) {
  switch(action.type) {
    case authActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.id,
        action.payload.token,
        action.payload.tokenExpirationDate
      )
      return {
        ...state,
        loading: false,
        errorMessage: null,
        user
      };
    case authActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    case authActions.LOGIN_START:
    case authActions.SIGNUP_START:
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case authActions.CLOSE_ERROR: 
      return {
        ...state,
        errorMessage: null,
      };
    case authActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        user:null
      }
    default:
      return state;
  }
}