import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  SIGNIN_FACEBOOK_USER,
  SIGNIN_FACEBOOK_USER_SUCCESS,
  SIGNIN_GITHUB_USER,
  SIGNIN_GITHUB_USER_SUCCESS,
  SIGNIN_GOOGLE_USER,
  SIGNIN_GOOGLE_USER_SUCCESS,
  SIGNIN_TWITTER_USER,
  SIGNIN_TWITTER_USER_SUCCESS,
  SIGNIN_USER,
  SIGNIN_USER_ERROR,
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER,
  SIGNOUT_USER_SUCCESS,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
  LOG_OUT,
  UPDATE_COMPANY_TWO_FACTOR_AUTH,
  UPDATE_COMPANY_TWO_FACTOR_AUTH_SUCCESS,
  UPDATE_COMPANY_TWO_FACTOR_AUTH_FAILED,
  GET_CUSTOMER_ME_SUCCESS,
} from "constants/ActionTypes";
import { createAwaitAction } from "@protego/sdk/actions/utils";

import { WAIT_FOR_ACTION, ERROR_ACTION } from "redux-wait-for-action";
export const logout = () => {
  return {
    type: LOG_OUT,
  };
};

export const userSignUp = (user) => {
  return {
    type: SIGNUP_USER,
    payload: user,
  };
};
export const userSignIn = (user) => {
  return {
    type: SIGNIN_USER,
    payload: user,
    [WAIT_FOR_ACTION]: SIGNIN_USER_SUCCESS,
    [ERROR_ACTION]: SIGNIN_USER_ERROR,
  };
};
export const userSignOut = () => {
  return {
    type: SIGNOUT_USER,
  };
};
export const userSignUpSuccess = (authUser) => {
  return {
    type: SIGNUP_USER_SUCCESS,
    payload: authUser,
  };
};

export const userSignInSuccess = (authUser) => {
  return {
    type: SIGNIN_USER_SUCCESS,
    payload: authUser,
  };
};
export const userSignOutSuccess = () => {
  return {
    type: SIGNOUT_USER_SUCCESS,
  };
};

export const showAuthMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message,
  };
};

export const userGoogleSignIn = () => {
  return {
    type: SIGNIN_GOOGLE_USER,
  };
};
export const userGoogleSignInSuccess = (authUser) => {
  return {
    type: SIGNIN_GOOGLE_USER_SUCCESS,
    payload: authUser,
  };
};
export const userFacebookSignIn = () => {
  return {
    type: SIGNIN_FACEBOOK_USER,
  };
};
export const userFacebookSignInSuccess = (authUser) => {
  return {
    type: SIGNIN_FACEBOOK_USER_SUCCESS,
    payload: authUser,
  };
};
export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url,
  };
};
export const userTwitterSignIn = () => {
  return {
    type: SIGNIN_TWITTER_USER,
  };
};
export const userTwitterSignInSuccess = (authUser) => {
  return {
    type: SIGNIN_TWITTER_USER_SUCCESS,
    payload: authUser,
  };
};
export const userGithubSignIn = () => {
  return {
    type: SIGNIN_GITHUB_USER,
  };
};
export const userGithubSignInSuccess = (authUser) => {
  return {
    type: SIGNIN_GITHUB_USER_SUCCESS,
    payload: authUser,
  };
};
export const showAuthLoader = () => {
  return {
    type: ON_SHOW_LOADER,
  };
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};
export const hideAuthLoader = () => {
  return {
    type: ON_HIDE_LOADER,
  };
};
export const updateCompanyTwoFactorAuth = (whitelist) => {
  return {
    type: UPDATE_COMPANY_TWO_FACTOR_AUTH,
    payload: whitelist,
  };
};

export const updateCompanyTwoFactorAuthSuccess = (response) => {
  return {
    type: UPDATE_COMPANY_TWO_FACTOR_AUTH_SUCCESS,
    payload: response,
  };
};

export const updateCompanyTwoFactorAuthFailed = () => {
  return {
    type: UPDATE_COMPANY_TWO_FACTOR_AUTH_FAILED,
  };
};
export const getCustomerMeSuccess = (response) => {
  return {
    type: GET_CUSTOMER_ME_SUCCESS,
    payload: response,
  };
};

export const REFRESH_TOKEN = createAwaitAction("refresh_token");
