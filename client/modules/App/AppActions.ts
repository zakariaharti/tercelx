import { IUser } from './types/user';

/**
 * export action types as enum
 */
export enum actionTypes {
  USER_LOGIN = 'ACTIONS/USER_LOGIN',
  USER_SIGNUP = 'ACTIONS/USER_SIGNUP',
  USER_AUTHENTICATION_SUCCESS = 'ACTIONS/USER_AUTHENTICATION_SUCCESS',
  LOGIN_FAILED = 'ACTIONS/LOGIN_FAILED',
  SIGNUP_FAILED = 'ACTIONS/SIGNUP_FAILED',
  USER_ERROR = 'ACTIONS/USER_ERROR'
};

/**
 * export action creators types
 */
export interface IUserLogin {
  type: actionTypes.USER_LOGIN;
}

export interface IUserSignup {
  type: actionTypes.USER_SIGNUP;
}

export interface IUserAuthenticationSuccess {
  type: actionTypes.USER_AUTHENTICATION_SUCCESS;
  payload: IUser;
}

export interface IloginFailed {
  type: actionTypes.LOGIN_FAILED;
  payload: any;
}

export interface ISignupFailed {
  type: actionTypes.SIGNUP_FAILED;
  payload: any;
}

export interface IUserError {
  type: actionTypes.USER_ERROR;
  payload: any;
}

/**
 * action creators
 */
export const loginUser = (): IUserLogin => {
  return {
    type: actionTypes.USER_LOGIN
  }
};

export const signupUser = (): IUserSignup => {
  return {
    type: actionTypes.USER_SIGNUP
  }
};

export const authenticateUser = (payload: IUser): IUserAuthenticationSuccess => {
  return {
    type: actionTypes.USER_AUTHENTICATION_SUCCESS,
    payload
  }
};

export const failLogin = (payload: any): IloginFailed => {
  return {
    type: actionTypes.LOGIN_FAILED,
    payload
  }
};

export const failSignup = (payload: any): ISignupFailed => {
  return {
    type: actionTypes.SIGNUP_FAILED,
    payload
  }
};

export const errorUser = (payload: any): IUserError => {
  return {
    type: actionTypes.USER_ERROR,
    payload
  }
};

/*
 * actions types
 */
export type actions = IUserLogin | IUserError | IUserSignup | IUserAuthenticationSuccess
  | ISignupFailed | IloginFailed;
