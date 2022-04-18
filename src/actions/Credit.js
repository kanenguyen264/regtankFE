import {
  FETCH_CUSTOMER_CREDIT,
  FETCH_CUSTOMER_CREDIT_FAILED,
  FETCH_CUSTOMER_CREDIT_SUCCESS,
  FETCH_CREDIT_BUNDLE,
  FETCH_CREDIT_BUNDLE_SUCCESS,
  FETCH_CREDIT_BUNDLE_FAILED,
  SET_BILLING_TOP,
  SET_BILLING_TOP_SUCCESS,
  SET_BILLING_RENEW,
  SET_BILLING_RENEW_SUCCESS,
  SHOW_MESSAGE
} from "constants/ActionTypes";

export const fetchCustomerCredit = (data) => {
  return {
    type: FETCH_CUSTOMER_CREDIT,
    payload: data
  };
};

export const fetchCustomerCreditSuccess = (response) => {
  return {
    type: FETCH_CUSTOMER_CREDIT_SUCCESS,
    payload: response
  };
};

export const fetchCustomerCreditFailed = () => {
  return {
    type: FETCH_CUSTOMER_CREDIT_FAILED
  };
};
export const fetchCreditBundle = (data) => {
  return {
    type: FETCH_CREDIT_BUNDLE,
    payload: data
  };
};

export const fetchCreditBundleSuccess = (response) => {
  return {
    type: FETCH_CREDIT_BUNDLE_SUCCESS,
    payload: response
  };
};

export const fetchCreditBundleFailed = () => {
  return {
    type: FETCH_CREDIT_BUNDLE_FAILED
  };
};
export const updateSetBillingTop = (params) => {
  return {
    type: SET_BILLING_TOP,
    payload: params
  };
};
export const updateSetBillingTopSuccess = (response) => {
  return {
    type: SET_BILLING_TOP_SUCCESS,
    payload: response
  };
};
export const updateSetBillingRenew = (params) => {
  return {
    type: SET_BILLING_RENEW,
    payload: params
  };
};
export const updateSetBillingRenewSuccess = (response) => {
  return {
    type: SET_BILLING_RENEW_SUCCESS,
    payload: response
  };
};
export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};
