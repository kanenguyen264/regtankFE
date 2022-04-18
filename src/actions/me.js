import {
  FETCH_ME,
  FETCH_ME_FAILED,
  FETCH_ME_SUCCESS,
  SHOW_MESSAGE,
  UPDATE_MY_PROFILE,
  UPDATE_MY_PROFILE_SUCCESS,
  GET_MFA_INFO,
  GET_MFA_INFO_FAILED,
  GET_MFA_INFO_SUCCESS,
  GET_MFA_VERIFY,
  GET_MFA_VERIFY_SUCCESS,
  GET_MFA_VERIFY_FAILED,
  HIDE_MESSAGE,
  UPDATE_TWO_FACTOR_AUTH,
  UPDATE_TWO_FACTOR_AUTH_SUCCESS,
  UPDATE_TWO_FACTOR_AUTH_FAILED
} from "constants/ActionTypes";

export const fetchMe = (params) => {
  return {
    type: FETCH_ME,
    payload: params
  };
};

export const fetchMeSuccess = (response) => {
  return {
    type: FETCH_ME_SUCCESS,
    payload: response
  };
};

export const fetchMeFailed = () => {
  return {
    type: FETCH_ME_FAILED
  };
};

export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};
//update my profile
export const updateMyProfile = (params) => {
  return {
    type: UPDATE_MY_PROFILE,
    payload: params
  };
};
export const updateMyProfileSuccess = (response) => {
  return {
    type: UPDATE_MY_PROFILE_SUCCESS,
    payload: response
  };
};
/**
 * MFA Profile
 */

export const getMFAProfile = (payload) => {
  return {
    type: GET_MFA_INFO,
    payload: payload
  };
};
export const getMFAProfileSuccess = (payload) => {
  return {
    type: GET_MFA_INFO_SUCCESS,
    payload: payload
  };
};

export const getMFAProfileFailed = (payload) => {
  return {
    type: GET_MFA_INFO_FAILED,
    payload: payload
  };
};

export const getMFAVerify = (payload) => {
  return {
    type: GET_MFA_VERIFY,
    payload: payload
  };
};
export const getMFAVerifySuccess = (payload) => {
  return {
    type: GET_MFA_VERIFY_SUCCESS,
    payload: payload
  };
};

export const getMFAVerifyFailed = (payload) => {
  return {
    type: GET_MFA_VERIFY_FAILED,
    payload: payload
  };
};

export const updateTwoFactorAuth = (payload) => {
  return {
    type: UPDATE_TWO_FACTOR_AUTH,
    payload: payload
  };
};
export const updateTwoFactorAuthSuccess = (payload) => {
  return {
    type: UPDATE_TWO_FACTOR_AUTH_SUCCESS,
    payload: payload
  };
};

export const updateTwoFactorAuthFailed = (payload) => {
  return {
    type: UPDATE_TWO_FACTOR_AUTH_FAILED,
    payload: payload
  };
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE
  };
};
